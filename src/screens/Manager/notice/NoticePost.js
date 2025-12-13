import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useState } from 'react';
import SemiBoldText from '../../../components/customText/SemiBoldText';
import { launchImageLibrary } from 'react-native-image-picker';
import ManagePageNavHeader from '../../../components/nav/ManagePageNavHeader';

const NoticePost = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState([]);

  const [useVote, setUseVote] = useState(false);

  const [voteOptions, setVoteOptions] = useState(['']);
  const [voteType, setVoteType] = useState('single');

  const currentTime = new Date().toISOString();

  const pickImage = () => {
    if (selectedImage.length >= 5) {
      Alert.alert('최대 5장까지 첨부할 수 있습니다.');
      return;
    }
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.3,
        maxWidth: 1200,
        maxHeight: 1200,
        includeBase64: false,
        selectionLimit: 1,
      },
      response => {
        if (response.didCancel) return;
        if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
          return;
        }

        const asset = response.assets[0];

        if (asset.fileSize && asset.fileSize > 3 * 1024 * 1024) {
          Alert.alert('이미지 파일이 너무 큽니다. 3MB 이하로 선택해 주세요');
          return;
        }

        setSelectedImage(prev => [...prev, asset.uri]);
      },
    );
  };

  const removeImage = uri => {
    setSelectedImage(prev => prev.filter(img => img !== uri));
  };

  const addVoteOption = () => {
    setVoteOptions(prev => [...prev, '']);
  };

  const updateVoteOption = (text, index) => {
    const updated = [...voteOptions];
    updated[index] = text;
    setVoteOptions(updated);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        <ScrollView>
          <ManagePageNavHeader pageName="공지" navigation={navigation} />

          <View style={styles.postInputCard}>
            <View style={styles.postInputSection}>
              <TextInput
                style={[
                  styles.textInputStyle,
                  { color: title ? '#7242E2' : '#ADADAD' },
                ]}
                placeholder="제목을 입력하세요"
                placeholderTextColor="#ADADAD"
                value={title}
                onChangeText={setTitle}
              />

              <View style={styles.divider} />

              <View style={styles.iconGroup}>
                <TouchableOpacity
                  onPress={pickImage}
                  style={styles.iconButtonStyle}
                >
                  <Image
                    source={require('../../../assets/img/noticeImageIcon.png')}
                    style={styles.imageIcon}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setUseVote(true)}
                  style={styles.iconButtonStyle}
                >
                  <Image
                    source={require('../../../assets/img/noticeVoteIcon.png')}
                    style={styles.VoteIcon}
                  />
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.imagePreviewScroll}
                contentContainerStyle={styles.imagePreviewContent}
              >
                {selectedImage.map((uri, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image
                      source={{ uri }}
                      style={styles.selectedImageStyle}
                      resizeMode="cover"
                    />

                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeImage(uri)}
                    >
                      <Image
                        source={require('../../../assets/img/disabledIcon.png')}
                        style={styles.removeIcon}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>

              {useVote && (
                <View style={styles.voteBox}>
                  <SemiBoldText style={styles.voteTitle}>
                    투표 옵션
                  </SemiBoldText>

                  {/* 단일 / 중복 투표 선택 */}
                  <View style={styles.voteTypeRow}>
                    <TouchableOpacity
                      style={[
                        styles.typeBtn,
                        voteType === 'single' && styles.typeBtnActive,
                      ]}
                      onPress={() => setVoteType('single')}
                    >
                      <SemiBoldText
                        style={[
                          styles.typeBtnText,
                          voteType === 'single'
                            ? styles.typeBtnTextActive
                            : styles.typeBtnTextInactive,
                        ]}
                      >
                        단일
                      </SemiBoldText>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.typeBtn,
                        voteType === 'multi' && styles.typeBtnActive,
                      ]}
                      onPress={() => setVoteType('multi')}
                    >
                      <SemiBoldText
                        style={[
                          styles.typeBtnText,
                          voteType === 'multi'
                            ? styles.typeBtnTextActive
                            : styles.typeBtnTextInactive,
                        ]}
                      >
                        중복
                      </SemiBoldText>
                    </TouchableOpacity>
                  </View>

                  {voteOptions.map((opt, idx) => (
                    <View key={idx} style={styles.voteInputRow}>
                      <Image
                        source={require('../../../assets/img/noticeVoteCheckIcon.png')}
                        style={styles.checkboxIcon}
                      />
                      <TextInput
                        style={styles.voteInput}
                        placeholder="내용을 입력하세요"
                        placeholderTextColor="#ADADAD"
                        value={opt}
                        onChangeText={text => updateVoteOption(text, idx)}
                      />
                    </View>
                  ))}

                  <TouchableOpacity
                    onPress={addVoteOption}
                    style={styles.addOptionButton}
                  >
                    <Image
                      source={require('../../../assets/img/addOptionIcon.png')}
                      style={styles.addOptionIcon}
                    />
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.contentSection}>
                <TextInput
                  style={styles.contentInputStyle}
                  placeholder="내용을 입력하세요"
                  placeholderTextColor="#ADADAD"
                  value={content}
                  onChangeText={setContent}
                  multiline={true}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>
          <View style={styles.postButtonSection}>
            <TouchableOpacity
              style={styles.postButton}
              onPress={() =>
                navigation.navigate('MyNoticeDetail', {
                  title: title,
                  content: content,
                  authorName: '고하늘',
                  createdAt: currentTime,
                  image: selectedImage,
                  vote: useVote
                    ? {
                        type: voteType,
                        options: voteOptions,
                      }
                    : null,
                })
              }
            >
              <SemiBoldText style={styles.postText}>등록하기</SemiBoldText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default NoticePost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 8,
  },
  postInputCard: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  postInputSection: {
    marginTop: 25,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    width: '90%',
    borderRadius: 20,
    padding: 25,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  textInputStyle: {
    fontSize: 22,
    fontFamily: 'Freesentation-6SemiBold',
    marginTop: 20,
  },
  divider: {
    borderWidth: 0.8,
    width: '100%',
    borderColor: '#ADADAD',
    marginVertical: 17,
  },
  imagePreviewScroll: {
    width: '100%',
    marginBottom: 15,
  },
  imagePreviewContent: {
    flexDirection: 'row',
    gap: 5,
  },
  imageContainer: {
    position: 'relative',
  },
  selectedImageStyle: {
    width: 130,
    height: 130,
    borderRadius: 20,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 5,
    padding: 4,
    elevation: 3,
  },
  removeIcon: {
    width: 24,
    height: 24,
  },
  contentSection: {
    width: '100%',
    // height: 280,
  },
  contentInputStyle: {
    fontSize: 17,
    fontFamily: 'Fressentation-4Regular',
    color: '#3E247C',
  },
  postButtonSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  postButton: {
    width: '90%',
    height: 61,
    borderRadius: 16,
    backgroundColor: '#7242E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postText: {
    fontSize: 26,
    color: '#FFFFFF',
  },

  iconGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 15,
    marginBottom: 15,
  },
  imageIcon: {
    width: 16,
    height: 16,
  },
  VoteIcon: {
    width: 19,
    height: 16,
  },

  voteBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    paddingVertical: 20,
    paddingHorizontal: 25,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  checkboxIcon: {
    width: 20,
    height: 20,
    marginLeft: 7,
  },
  addOptionIcon: {
    width: 26,
    height: 26,
  },
  voteTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: '#7242E2',
  },
  voteInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 15,
    gap: 20,
    borderColor: '#ADADAD',
    paddingLeft: 10,
    marginTop: 10,
    height: 50,
  },
  voteInput: {
    fontSize: 16,
    color: '#ADADAD',
    width: '75%',
    fontFamily: 'Freesentation-6SemiBold',
  },
  addOptionButton: {
    alignSelf: 'center',
    marginVertical: 10,
    marginTop: 15,
  },

  voteTypeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 20,
  },
  typeBtn: {
    width: '45%',
    paddingVertical: 10,
    backgroundColor: '#F1F1F1',
    borderRadius: 10,
    alignItems: 'center',
  },
  typeBtnActive: {
    backgroundColor: '#EEE7FF',
  },
  typeBtnTextActive: {
    color: '#3E247C',
  },
  typeBtnTextInactive: {
    color: '#ADADAD',
  },
});
