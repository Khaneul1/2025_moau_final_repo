import React, { forwardRef, useState, useImperativeHandle } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import SemiBoldText from '../../../components/customText/SemiBoldText';
import RegularText from '../../../components/customText/RegularText';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import isBetween from 'dayjs/plugin/isBetween';

import DateTimePicker from '@react-native-community/datetimepicker';
import { useScheduleStore } from '../../../store/useScheduleStore';

dayjs.extend(isoWeek);
dayjs.extend(isBetween);

const CalendarView = forwardRef(
  ({ teamId, initialMode = 'month', startDateOverride = null }, ref) => {
    const { schedules, addSchedule, removeSchedule } = useScheduleStore();

    const buildDateTime = (date, time) => {
      if (!time) return date.startOf('day');
      return date.hour(time.hour()).minute(time.minute()).second(0);
    };

    const [mode, setMode] = useState(initialMode); //현재 모드 month 또는 week
    const [currentDate, setCurrentDate] = useState(dayjs());

    const [selectedDate, setSelectedDate] = useState(null); //사용자가 눌렀을 때 선택되는 날짜
    const [selectedEvent, setSelectedEvent] = useState(null);

    const [modalVisible, setModalVisible] = useState(false); //일정 추가 모달 노출 여부
    const [detailModalVisible, setDetailModalVisible] = useState(false); //일정 상세 모달 노출 여부

    const [eventType, setEventType] = useState(null); //상세보기용으로 선택된 이벤트 객체
    const [newEventTitle, setNewEventTitle] = useState(''); //사용자가 모달에 입력하는 일정 제목
    const [eventLocation, setEventLocation] = useState(''); //사용자가 모달에 입력하는 일정 장소
    const [eventStartTime, setEventStartTime] = useState(null); //date picker 사용해서 시간 입력할 수 있도록...

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    //외부에서 호출 가능한 메서드!! 다른 페이지에서 가져다 쓰기 위함
    useImperativeHandle(ref, () => ({
      openMonthView: () => {
        setMode('month');
      },
      setModeExternally: m => {
        if (m === 'month' || m === 'week') setMode(m);
      },
    }));

    //날짜 계산
    const generateDates = () => {
      //month면 해당 달의 첫째 주 시작부터 마지막 주 끝까지
      //week면 그 주의 시작에서 끝만!! 총 7일만 생성
      const start =
        mode === 'month'
          ? currentDate.startOf('month').startOf('week')
          : currentDate.startOf('week');

      const end =
        mode === 'month'
          ? currentDate.endOf('month').endOf('week')
          : currentDate.endOf('week');

      const dates = [];
      let day = start;

      //반복문으로 하루씩 추가
      while (day.isBefore(end) || day.isSame(end)) {
        dates.push(day);
        day = day.add(1, 'day');
      }
      return dates;
    };

    //이전 버튼! 모드에 따라서 한 달 또는 한 주 앞으로 이동한다
    const handlePrev = () => {
      setCurrentDate(
        mode === 'month'
          ? currentDate.subtract(1, 'month')
          : currentDate.subtract(1, 'week'),
      );
    };

    //다음 버튼! 마찬가지로 모드에 따라 한 달 또는 한 주 뒤로 이동
    const handleNext = () => {
      setCurrentDate(
        mode === 'month'
          ? currentDate.add(1, 'month')
          : currentDate.add(1, 'week'),
      );
    };

    //날짜 선택할 경우 일정 추가 모달을 띄운다
    const openModal = date => {
      setSelectedDate(date);
      setStartDate(date);
      setEndDate(null);
      setEventType('null');
      setNewEventTitle('');
      setEventLocation('');
      setEventStartTime(null);
      setModalVisible(true);
    };

    const onTimeChange = (_, selected) => {
      if (selected) setEventStartTime(dayjs(selected));
      setShowEndPicker(false);
      setShowTimePicker(false);
    };

    //일정 추가
    const addEvent = async () => {
      if (!newEventTitle.trim() || !startDate) return;

      const baseStart =
        eventType === 'range' && endDate
          ? startDate.isBefore(endDate)
            ? startDate
            : endDate
          : startDate;

      const baseEnd =
        eventType === 'range' && endDate
          ? startDate.isAfter(endDate)
            ? startDate
            : endDate
          : startDate;

      const startsAt = buildDateTime(baseStart, eventStartTime);
      const endsAt =
        eventType === 'range'
          ? baseEnd.endOf('day')
          : buildDateTime(baseStart, eventStartTime);

      const scheduleData = {
        title: newEventTitle,
        location: eventLocation || '',
        startsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString(),
        isAllDay: !eventStartTime,
        teamId: teamId || null,
      };

      if (teamId) {
        await addSchedule(teamId, scheduleData); // 팀 일정
      } else {
        await addSchedule(null, scheduleData); // 개인 일정
      }

      setModalVisible(false);
    };

    const deleteEvent = async scheduleId => {
      await removeSchedule(scheduleId);
      setDetailModalVisible(false);
    };

    const getEventForDate = date => {
      return schedules.filter(e => {
        const target = dayjs(date).startOf('day');
        const start = dayjs(e.startsAt).startOf('day');
        const end = dayjs(e.endsAt).startOf('day');

        const isInDate =
          target.isSame(start) ||
          target.isSame(end) ||
          target.isBetween(start, end, null, '[]');

        const isSameTeam = teamId ? e.teamId === teamId : true;
        return isInDate && isSameTeam;
      });
    };

    const openDetailModal = event => {
      setSelectedEvent(event);
      setDetailModalVisible(true);
    };

    const dates = generateDates();
    const monthName = currentDate.format('YYYY년 M월');

    // 날짜 클릭 처리! 이벤트 타입 상태에 따라 행동이 달라짐
    const handleDateSelect = date => {
      // 1) eventType이 'range'이면서 startDate가 비어있다면 startDate를 채운다 (기간 선택)
      // 2) eventType이 'selectEnd'라면 endDate로 지정 후 evenType을 'range'로 바꾼다
      // 3) 그 외엔 openModal(일정 추가) 호출!

      if (eventType === 'range' && !startDate) {
        setStartDate(date);
      } else if (eventType === 'selectEnd') {
        setEndDate(date);
        setEventType('range');
      } else {
        openModal(date);
      }
    };

    return (
      <View style={styles.container}>
        {/* <ScrollView> */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handlePrev}>
            <SemiBoldText style={styles.arrow}>{'<'}</SemiBoldText>
          </TouchableOpacity>
          <SemiBoldText style={styles.title}>{monthName}</SemiBoldText>
          <TouchableOpacity onPress={handleNext}>
            <SemiBoldText style={styles.arrow}>{'>'}</SemiBoldText>
          </TouchableOpacity>
        </View>

        <View style={styles.weekDays}>
          {['일', '월', '화', '수', '목', '금', '토'].map(d => (
            <SemiBoldText key={d} style={styles.dayLabel}>
              {d}
            </SemiBoldText>
          ))}
        </View>

        {/* 달력... dates 배열을 map 해서 각 날짜의 셀을 생성함 */}
        <View style={styles.calendarGrid}>
          {dates.map(date => (
            <TouchableOpacity
              key={date.format('YYYY-MM-DD')}
              style={[styles.dateCell, mode === 'week' && { marginTop: 8 }]}
              onPress={() => handleDateSelect(date)}
            >
              {/* 날짜 숫자 (오늘이면 강조하기) */}
              <SemiBoldText
                style={[
                  styles.dateText,
                  date.day() === 0 && { color: '#FF0000' },
                  date.day() === 6 && { color: '#3197DA' },
                  date.isSame(dayjs(), 'day') && {
                    backgroundColor: '#F1F1F1',
                    borderRadius: 20,
                    width: 35,
                    textAlign: 'center',
                  },
                  //현재 달이 아닌 날짜는 다른 색상 처리!!
                  !date.isSame(currentDate, 'month') && { color: '#ADADAD' },
                ]}
              >
                {date.date()}
              </SemiBoldText>

              {/* 그 날짜에 속한 이벤트들을 표시함! (간단한 border 박스로) */}
              <View style={styles.eventContainer}>
                {getEventForDate(date).map(event => (
                  <TouchableOpacity
                    key={event.title}
                    onPress={() => openDetailModal(event)}
                    activeOpacity={0.8}
                    style={styles.eventTouchable}
                  >
                    <View style={styles.eventHighlight}>
                      <RegularText
                        style={styles.eventText}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {event.title}
                      </RegularText>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <SemiBoldText style={styles.modalTitle}>
                    일정 추가
                  </SemiBoldText>

                  <View style={styles.eventTypeSwitch}>
                    <TouchableOpacity
                      style={[
                        styles.typeBtn,
                        eventType === 'day' && styles.activeTypeBtn,
                      ]}
                      onPress={() => {
                        setEventType('day');
                        setStartDate(selectedDate);
                        setEndDate(selectedDate);
                      }}
                    >
                      <RegularText
                        style={[
                          styles.typeText,
                          eventType === 'day' && styles.activeTypeBtnText,
                        ]}
                      >
                        하루
                      </RegularText>
                    </TouchableOpacity>

                    {/* 기간 선택 시작할 때 startDate가 비어있으면 selectedDate를 기본으로 둠! */}
                    {/* if (!startDate) setStartDate(selectedDate); */}
                    <TouchableOpacity
                      style={[
                        styles.typeBtn,
                        eventType === 'range' && styles.activeTypeBtn,
                      ]}
                      onPress={() => {
                        setEventType('range');
                        setStartDate(selectedDate);
                        setEndDate(null);
                      }}
                    >
                      <RegularText
                        style={[
                          styles.typeText,
                          eventType === 'range' && styles.activeTypeBtnText,
                        ]}
                      >
                        기간
                      </RegularText>
                    </TouchableOpacity>
                  </View>

                  {eventType === 'range' && (
                    <>
                      <TouchableOpacity onPress={() => setShowEndPicker(true)}>
                        <SemiBoldText style={styles.modalSub}>
                          종료일: {endDate?.format('YYYY-MM-DD') || '선택'}
                        </SemiBoldText>
                      </TouchableOpacity>
                      {showEndPicker && (
                        <DateTimePicker
                          value={
                            eventStartTime
                              ? eventStartTime.toDate()
                              : new Date()
                          }
                          mode="date"
                          onChange={(_, d) => {
                            setShowEndPicker(false);
                            if (d) setEndDate(dayjs(d));
                          }}
                        />
                      )}
                    </>
                  )}

                  <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                    <SemiBoldText style={styles.modalSub}>
                      시작 시간 (선택):{' '}
                      {eventStartTime
                        ? eventStartTime.format('HH:mm')
                        : '선택해 주세요'}
                    </SemiBoldText>
                  </TouchableOpacity>

                  {showTimePicker && (
                    <View style={styles.selectedTime}>
                      <DateTimePicker
                        value={
                          eventStartTime ? eventStartTime.toDate() : new Date()
                        }
                        mode="time"
                        display="spinner"
                        is24Hour={true}
                        onChange={onTimeChange}
                        style={{ height: 200 }}
                      />
                    </View>
                  )}

                  <TextInput
                    placeholder="일정을 입력하세요"
                    placeholderTextColor="#B5B2B2"
                    value={newEventTitle}
                    onChangeText={setNewEventTitle}
                    style={styles.input}
                  />

                  <TextInput
                    placeholder="장소를 입력하세요"
                    placeholderTextColor="#B5B2B2"
                    value={eventLocation}
                    onChangeText={setEventLocation}
                    style={styles.input}
                  />

                  <View style={styles.modalButtons}>
                    <TouchableOpacity onPress={addEvent} style={styles.addBtn}>
                      <RegularText style={styles.addText}>추가</RegularText>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        setModalVisible(false);
                        //   setEventType(null);
                        //   setStartDate(null);
                        //   setEndDate(null);
                        //   setEventLocation('');
                        //   setEventStartTime(null);
                        //   setNewEventTitle('');
                      }}
                      style={styles.cancelBtn}
                    >
                      <RegularText style={styles.cancelText}>취소</RegularText>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* 상세 모달 */}
        <Modal
          visible={detailModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setDetailModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <SemiBoldText style={styles.modalTitle}>상세 일정</SemiBoldText>
              <SemiBoldText style={styles.scheduleTitle}>
                {selectedEvent?.title}
              </SemiBoldText>

              {/* {selectedEvent?.description && (
                <RegularText>{selectedEvent.description}</RegularText>
              )} */}

              {selectedEvent &&
              dayjs(selectedEvent.startsAt).isSame(selectedEvent.endsAt) ? (
                <RegularText style={styles.detailSub}>
                  {dayjs(selectedEvent.startsAt).format('YYYY-MM-DD')}
                </RegularText>
              ) : (
                <RegularText style={styles.detailSub}>
                  {selectedEvent?.start} ~ {selectedEvent?.end}
                </RegularText>
              )}

              {/* 시작 시간 */}
              {selectedEvent?.startTime ? (
                <RegularText style={styles.detailSub}>
                  시간 : {selectedEvent.startTime}
                </RegularText>
              ) : null}

              {/* 장소 */}
              {selectedEvent?.location ? (
                <RegularText style={styles.detailSub}>
                  장소 : {selectedEvent.location}
                </RegularText>
              ) : null}

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  onPress={() => deleteEvent(selectedEvent?.id)}
                  style={styles.deleteBtn}
                >
                  <RegularText style={styles.deleteText}>삭제</RegularText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setDetailModalVisible(false)}
                  style={styles.cancelBtn}
                >
                  <RegularText style={styles.cancelText}>닫기</RegularText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/* </ScrollView> */}
      </View>
    );
  },
);

export default CalendarView;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  arrow: {
    fontSize: 20,
    color: '#3E247C',
    alignSelf: 'flex-end',
    marginLeft: 25,
    marginRight: 25,
  },
  title: {
    fontSize: 20,
    color: '#3E247C',
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
    marginTop: 5,
    width: '100%',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  dayLabel: {
    width: '13%',
    textAlign: 'center',
    color: '#ADADAD',
    fontSize: 16,
  },
  dateCell: {
    width: '13%',
    minHeight: 70,
    alignItems: 'center',
    marginVertical: 4,
    marginTop: 30,
    paddingBottom: 6,
  },
  dateText: {
    fontSize: 16,
    color: '#3E247C',
  },
  eventContainer: {
    alignSelf: 'stretch',
    paddingHorizontal: 6,
    marginTop: 6,
  },
  eventTouchable: {
    alignSelf: 'stretch',
  },
  eventHighlight: {
    backgroundColor: '#EEE7FF',
    borderRadius: 6,
    paddingHorizontal: 6,
    marginTop: 4,
    paddingVertical: 6,
    alignItems: 'flex-start',
    alignSelf: 'stretch',
  },
  eventText: {
    fontSize: 12,
    color: '#3E247C',
    textAlign: 'left',
    width: '100%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 25,
    borderRadius: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#7242E2',
  },
  modalSub: {
    fontSize: 14,
    color: '#ADADAD',
    marginBottom: 6,
    fontWeight: 'bold',
  },
  detailSub: {
    fontSize: 14,
    color: '#3E247C',
    paddingVertical: 2,
  },
  input: {
    borderWidth: 0.5,
    borderColor: '#B5B2B2',
    borderRadius: 8,
    padding: 12,
    marginTop: 5,
    color: '#3E247C',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 18,
  },
  addBtn: {
    backgroundColor: '#EEE7FF',
    borderRadius: 10,
    padding: 5,
    width: '48%',
    alignItems: 'center',
    marginRight: 5.5,
  },
  cancelBtn: {
    backgroundColor: '#F1F1F1',
    borderRadius: 10,
    padding: 5,
    width: '48%',
    alignItems: 'center',
    marginLeft: 5.5,
  },
  addText: {
    fontSize: 17,
    color: '#3E247C',
  },
  cancelText: {
    fontSize: 17,
    color: '#ADADAD',
  },
  deleteBtn: {
    backgroundColor: '#D60000',
    borderRadius: 10,
    padding: 5,
    width: '48%',
    alignItems: 'center',
    marginRight: 5.5,
  },
  deleteText: {
    color: '#FFFFFF',
    fontSize: 17,
  },
  scheduleTitle: {
    fontSize: 20,
    color: '#3E247C',
    marginBottom: 5,
  },
  eventRangeBox: {
    backgroundColor: '#EEE7FF',
    height: 25,
    justifyContent: 'center',
    marginTop: 6,
  },
  eventRangeStart: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    paddingLeft: 6,
  },
  eventRangeMiddle: {
    backgroundColor: '#EEE7FF',
    borderRadius: 0,
  },
  eventRangeEnd: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    paddingRight: 6,
  },

  // 일정 추가 부분
  eventTypeSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 15,
    marginVertical: 8,
  },
  typeBtn: {
    flex: 1,
    backgroundColor: '#F1F1F1',
    paddingVertical: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  typeText: {
    color: '#ADADAD',
    fontSize: 15,
    textAlign: 'center',
  },
  activeTypeBtn: {
    backgroundColor: '#EEE7FF',
    borderRadius: 10,
  },
  activeTypeBtnText: {
    color: '#7242E2',
  },
  selectedTime: {
    height: 200,
  },
});
