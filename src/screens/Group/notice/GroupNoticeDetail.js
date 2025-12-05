import React, { useState, useMemo } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import RegularText from '../../../components/customText/RegularText';
import SemiBoldText from '../../../components/customText/SemiBoldText';
import { noticeMockData } from '../../../data/notice';
import PageNavHeader from '../../../components/nav/PageNavHeader';
import dayjs from 'dayjs';
import CommentInput from '../../../components/comment/CommentInput';

const useAnonymousMapping = comments => {
  return useMemo(() => {
    let counter = 1;
    const mapping = {};

    const flat = [];
    comments.forEach(c => {
      flat.push({ ...c, isReply: false });
      c.replies.forEach(r => {
        flat.push({ ...r, isReply: true });
      });
    });

    flat.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    flat.forEach(item => {
      if (item.isAnonymous) {
        const key = item.authorName;
        if (!mapping[key]) {
          mapping[key] = `익명${counter}`;
          counter++;
        }
      }
    });

    return mapping;
  }, [comments]);
};

const GroupNoticeDetail = ({ route, navigation }) => {
  const { teamId, noticeId, isAdmin } = route.params;

  const notice = noticeMockData[teamId]?.find(n => n.id === noticeId);

  const [selectedOption, setSelectedOption] = useState(null);
  const [voteSubmitted, setVoteSubmitted] = useState(false);

  const [comments, setComments] = useState([]);
  const [inputText, setInputText] = useState('');
  const [replyTargetId, setReplyTargetId] = useState(null);
  const [isAnonymousComment, setIsAnonymousComment] = useState(true);

  const anonymousNameMap = useAnonymousMapping(comments);

  const addComment = () => {
    if (!inputText.trim()) return;

    const newComment = {
      id: Date.now(),
      content: inputText,
      createdAt: new Date().toISOString(),
      isAnonymous: isAnonymousComment,
      authorName: 'currentUser',
      replies: [],
    };

    setComments([...comments, newComment]);
    setInputText('');
  };

  const addReply = commentId => {
    if (!inputText.trim()) return;

    const updated = comments.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: [
            ...c.replies,
            {
              id: Date.now(),
              content: inputText,
              createdAt: new Date().toISOString(),
              isAnonymous: isAnonymousComment,
              authorName: 'currentUser',
            },
          ],
        };
      }
      return c;
    });
    setComments(updated);
    setInputText('');
    setReplyTargetId(null);
  };

  const getTotalCommentCount = () => {
    return comments.reduce((acc, c) => acc + 1 + c.replies.length, 0);
  };

  if (!notice) {
    return (
      <View style={styles.center}>
        <SemiBoldText>공지 정보를 불러올 수 없습니다.</SemiBoldText>
      </View>
    );
  }

  const handleVote = () => {
    if (selectedOption === null) return;
    setVoteSubmitted(true);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        <PageNavHeader pageName="공지" navigation={navigation} />
        <ScrollView>
          {/* 제목 */}
          <View style={styles.postSection}>
            <View style={styles.authorSection}>
              <SemiBoldText style={styles.authorName}>
                {notice.authorName}
              </SemiBoldText>
              <SemiBoldText style={styles.date}>
                {notice.createdAt}
              </SemiBoldText>
            </View>
            <SemiBoldText style={styles.title}>{notice.title}</SemiBoldText>
            <View style={styles.divider} />

            {notice.images?.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.imageScroll}
                contentContainerStyle={styles.imageRow}
              >
                {notice.images.map((img, idx) => (
                  <Image
                    key={idx}
                    source={{ uri: img }}
                    style={styles.noticeImage}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
            )}

            {/* 내용 */}
            <RegularText style={styles.content}>{notice.content}</RegularText>

            {/* 투표 */}
            {notice.vote && (
              <View style={styles.voteContainer}>
                {notice.vote.options.map(opt => {
                  const isSelected = selectedOption === opt.id;

                  return (
                    <TouchableOpacity
                      key={opt.id}
                      style={[
                        styles.voteOption,
                        { backgroundColor: isSelected ? '#EEE7FF' : '#F4F4F4' },
                      ]}
                      onPress={() => setSelectedOption(opt.id)}
                    >
                      <Image
                        source={
                          isSelected
                            ? require('../../../assets/img/noticeCheckPurpleIcon.png')
                            : require('../../../assets/img/noticeVoteCheckIcon.png')
                        }
                        style={styles.voteCheckBox}
                      />
                      <SemiBoldText
                        style={{
                          color: isSelected ? '#7242E2' : '#808080',
                          fontSize: 16,
                        }}
                      >
                        {opt.text}
                      </SemiBoldText>
                    </TouchableOpacity>
                  );
                })}

                <TouchableOpacity
                  style={[
                    styles.voteButton,
                    {
                      backgroundColor: voteSubmitted ? '#B5B2B2' : '#7242E2',
                    },
                  ]}
                  onPress={handleVote}
                >
                  <SemiBoldText style={{ color: '#FFFFFF', fontSize: 19 }}>
                    투표하기
                  </SemiBoldText>
                </TouchableOpacity>
              </View>
            )}

            {/* 관리자 기능 */}
            {isAdmin && (
              <View style={styles.adminButtonWrap}>
                <TouchableOpacity style={styles.adminBtn}>
                  <RegularText style={styles.adminText}>수정</RegularText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.adminBtn, { backgroundColor: '#FFD7D7' }]}
                >
                  <RegularText style={{ color: '#D93535' }}>삭제</RegularText>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.commentCount}>
            <Image
              source={require('../../../assets/img/commentCountIcon.png')}
              style={styles.commentIcon}
            />
            <SemiBoldText style={styles.commentCountText}>
              {getTotalCommentCount()}
            </SemiBoldText>
          </View>

          <View style={styles.commentCard}>
            {comments.map(comment => {
              const commentUser = comment.isAnonymous
                ? anonymousNameMap[comment.authorName]
                : comment.authorName;

              return (
                <View key={comment.id} style={styles.commentBox}>
                  <SemiBoldText style={styles.commentAuthor}>
                    {commentUser}
                  </SemiBoldText>
                  <SemiBoldText style={styles.commentContent}>
                    {comment.content}
                  </SemiBoldText>
                  <SemiBoldText style={styles.commentDateText}>
                    {dayjs(comment.createdAt).format('YYYY-MM-DD HH:mm')}
                  </SemiBoldText>

                  <TouchableOpacity
                    style={styles.replyButton}
                    onPress={() => setReplyTargetId(comment.id)}
                  >
                    <SemiBoldText style={styles.buttonText}>답글</SemiBoldText>
                  </TouchableOpacity>

                  {comment.replies.map(reply => {
                    const replyUser = reply.isAnonymous
                      ? anonymousNameMap[reply.authorName]
                      : reply.authorName;

                    return (
                      <View key={reply.id} style={styles.replyBox}>
                        <SemiBoldText style={styles.commentAuthor}>
                          {replyUser}
                        </SemiBoldText>
                        <SemiBoldText style={styles.commentContent}>
                          {reply.content}
                        </SemiBoldText>
                        <SemiBoldText style={styles.replyDateText}>
                          {dayjs(reply.createdAt).format('YYYY-MM-DD HH:mm')}
                        </SemiBoldText>
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>

          <CommentInput
            isAnonymous={isAnonymousComment}
            setIsAnonymous={setIsAnonymousComment}
            inputText={inputText}
            setInputText={setInputText}
            isReply={!!replyTargetId}
            onSubmit={() =>
              replyTargetId ? addReply(replyTargetId) : addComment()
            }
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default GroupNoticeDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorName: {
    fontSize: 17,
    color: '#3E247C',
  },
  date: {
    color: '#B5B2B2',
    fontSize: 13,
  },
  title: {
    color: '#7242E2',
    fontSize: 19,
    marginTop: 16,
  },
  divider: {
    borderWidth: 0.5,
    borderColor: '#B5B2B2',
    width: '100%',
    alignSelf: 'center',
    marginTop: 9,
    marginVertical: 17,
  },
  postSection: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    width: '90%',
    borderRadius: 20,
    padding: 25,
    alignSelf: 'center',
    marginTop: 25,
  },
  content: {
    color: '#3E247C',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 10,
  },
  imageScroll: {
    width: '100%',
  },
  imageRow: {
    flexDirection: 'row',
    gap: 10,
  },
  noticeImage: {
    width: 200,
    height: 200,
    borderRadius: 16,
  },
  // vote container
  voteContainer: {
    marginTop: 25,
    width: '100%',
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderWidth: 1,
    borderColor: '#ADADAD',
  },
  voteOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    gap: 20,
    paddingLeft: 10,
    marginTop: 5,
    marginBottom: 5,
    height: 50,
  },
  voteCheckBox: {
    width: 20,
    height: 20,
  },
  voteButton: {
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 14,
    paddingVertical: 16,
    paddingHorizontal: 25,
  },
  commentCount: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 25,
    marginLeft: 30,
    gap: 5,
  },
  commentIcon: {
    width: 15,
    height: 15,
  },
  commentCountText: {
    color: '#B5B2B2',
    fontSize: 12.5,
  },

  // comment card
  commentCard: {
    marginLeft: 30,
  },
  commentAuthor: {
    fontSize: 15,
    color: '#3E247C',
  },
  commentBox: {
    marginTop: 18,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    width: '90%',
  },
  commentContent: {
    fontSize: 14,
    color: '#808080',
    marginTop: 4,
  },
  commentDateText: {
    fontSize: 12,
    color: '#B5B2B2',
    marginTop: 4,
    marginBottom: 8,
  },
  replyButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ADADAD',
    width: 38,
    height: 20,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 1.5,
  },
  buttonText: {
    color: '#ADADAD',
    fontSize: 13,
  },
  replyBox: {
    marginTop: 10,
    marginLeft: 25,
    backgroundColor: '#F4F4F4',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    width: '88%',
  },
  replyDateText: {
    fontSize: 12,
    color: '#B5B2B2',
    marginTop: 4,
  },
});
