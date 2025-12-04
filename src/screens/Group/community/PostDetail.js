import {
  ScrollView,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import SemiBoldText from '../../../components/customText/SemiBoldText';
import BoldText from '../../../components/customText/BoldText';
import dayjs from 'dayjs';
import CommentInput from '../../../components/comment/CommentInput';
import PageNavHeader from '../../../components/nav/PageNavHeader';
import { useCommunityStore } from '../../../store/useCommunityStore';
import {
  createComment,
  deletePost,
  updatePost,
} from '../../../services/communityService';

const buildCommentTree = flatComments => {
  const map = {};
  const roots = [];

  flatComments.forEach(comment => {
    map[comment.id] = { ...comment, replies: [] };
  });

  flatComments.forEach(comment => {
    if (comment.parentId) {
      if (map[comment.parentId]) {
        map[comment.parentId].replies.push(map[comment.id]);
      }
    } else {
      roots.push(map[comment.id]);
    }
  });

  return roots;
};

const useAnonymousMapping = comments => {
  return useMemo(() => {
    let counter = 1;
    const mapping = {}; //userId -> 익명 번호

    const flat = []; //댓글+답글 전체를 시간순으로 정렬된 리스트로 변환

    comments.forEach(c => {
      flat.push({ ...c, isReply: false });
      c.replies?.forEach(r => {
        flat.push({ ...r, isReply: true });
      });
    });

    //댓글 생성 시간순 정렬
    flat.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    //익명 사용자 userId: 익명 번호 매핑
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

const PostDetail = ({ route, navigation }) => {
  const { teamId, postId } = route.params;

  const { postDetail, fetchPostDetail } = useCommunityStore();

  const [comments, setComments] = useState([]);
  const [inputText, setInputText] = useState('');
  const [replyTargetId, setReplyTargetId] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(true);

  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const load = async () => {
      await fetchPostDetail(teamId, postId);
    };
    load();
  }, [teamId, postId]);

  useEffect(() => {
    if (postDetail?.comments) {
      const commentTree = buildCommentTree(postDetail.comments || []);
      setComments(commentTree);
    }

    if (postDetail) {
      setEditTitle(postDetail.title);
      setEditContent(postDetail.content);
    }
  }, [postDetail]);

  const anonymousNameMap = useAnonymousMapping(comments);

  const getTotalCommentCount = post => {
    return comments.reduce((acc, c) => acc + 1 + c.replies.length, 0);
  };

  if (!postDetail) {
    return (
      <SemiBoldText style={{ fontSize: 12, color: '#ADADAD' }}>
        게시글을 찾을 수 없습니다.
      </SemiBoldText>
    );
  }

  const addComment = async () => {
    if (inputText.trim() === '') return;

    try {
      const createdId = await createComment(teamId, postId, {
        content: inputText,
        isAnonymous: isAnonymous,
        parentId: null,
      });

      console.log('댓글 작성 완료, ID:', createdId);
      setInputText('');
      await fetchPostDetail(teamId, postId);
    } catch (err) {
      console.error('댓글 작성 실패:', err);
    }
  };

  const addReply = async parentId => {
    if (inputText.trim() === '') return;

    try {
      const createdId = await createComment(teamId, postId, {
        content: inputText,
        isAnonymous: isAnonymous,
        parentId: parentId,
      });

      console.log('대댓글 작성 완료, ID:', createdId);

      setInputText('');
      setReplyTargetId(null);
      await fetchPostDetail(teamId, postId);
    } catch (err) {
      console.error('대댓글 작성 실패:', err);
    }
  };

  const handleDeletePost = async () => {
    Alert.alert('게시글 삭제', '정말로 이 게시글을 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletePost(teamId, postId);
            console.log('게시글 삭제 완료');
            navigation.goBack();
          } catch (err) {
            console.error('게시글 삭제 실패:', err);
          }
        },
      },
    ]);
  };

  const handleEditPost = async () => {
    try {
      await updatePost(teamId, postId, {
        title: editTitle,
        content: editContent,
        isAnonymous: postDetail.isAnonymous,
      });
      console.log('게시글 수정 완료');
      setIsEditing(false);
      await fetchPostDetail(teamId, postId);
    } catch (err) {
      console.error('게시글 수정 실패:', err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        <ScrollView>
          <PageNavHeader
            pageName="게시판"
            navigation={navigation}
            teamId={teamId}
          />

          <View style={styles.authorRow}>
            <View style={styles.postCard}>
              <View style={styles.authorCard}>
                <BoldText style={styles.author}>
                  {postDetail.authorName}
                </BoldText>
                <SemiBoldText style={styles.dateText}>
                  {dayjs(postDetail.createdAt).format('YYYY-MM-DD HH:mm')}
                </SemiBoldText>
              </View>

              {postDetail.isMyPost && (
                <View style={styles.editButtonGroup}>
                  {!isEditing ? (
                    <>
                      <TouchableOpacity
                        style={styles.smallButton}
                        onPress={() => setIsEditing(true)}
                      >
                        <SemiBoldText style={styles.smallButtonText}>
                          수정
                        </SemiBoldText>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.smallButton}
                        onPress={handleDeletePost}
                      >
                        <SemiBoldText style={styles.smallButtonText}>
                          삭제
                        </SemiBoldText>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity
                        style={[styles.smallButton, { borderColor: '#7242E2' }]}
                        onPress={handleEditPost}
                      >
                        <SemiBoldText
                          style={[styles.smallButtonText, { color: '#7242E2' }]}
                        >
                          저장
                        </SemiBoldText>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.smallButton}
                        onPress={() => {
                          setIsEditing(false);
                          setEditTitle(postDetail.title);
                          setEditContent(postDetail.content);
                        }}
                      >
                        <SemiBoldText style={styles.smallButtonText}>
                          취소
                        </SemiBoldText>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              )}
            </View>

            {/* <BoldText style={styles.postTitle}>{postDetail.title}</BoldText> */}
            {isEditing ? (
              <TextInput
                value={editTitle}
                onChangeText={setEditTitle}
                style={{
                  fontSize: 19,
                  color: '#7242E2',
                  marginTop: 16,
                  fontFamily: 'Freesentation-7Bold',
                }}
              />
            ) : (
              <BoldText style={styles.postTitle}>{postDetail.title}</BoldText>
            )}
            <View style={styles.divider} />
            {isEditing ? (
              <TextInput
                value={editContent}
                onChangeText={setEditContent}
                multiline
                style={styles.editContentInput}
              />
            ) : (
              <SemiBoldText style={styles.postContent}>
                {postDetail.content}
              </SemiBoldText>
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
              const displayName = comment.isAnonymous
                ? anonymousNameMap[comment.authorName]
                : comment.authorName;

              return (
                <View key={comment.id} style={styles.commentBox}>
                  <SemiBoldText style={styles.commentAuthor}>
                    {displayName}
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

                  {comment.replies?.map(reply => {
                    const replyName = reply.isAnonymous
                      ? anonymousNameMap[reply.authorName]
                      : reply.authorName;

                    return (
                      <View key={reply.id} style={styles.replyBox}>
                        <SemiBoldText style={styles.commentAuthor}>
                          {replyName}
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
        </ScrollView>
        <CommentInput
          inputText={inputText}
          setInputText={setInputText}
          isAnonymous={isAnonymous}
          setIsAnonymous={setIsAnonymous}
          isReply={replyTargetId !== null}
          onSubmit={() => {
            replyTargetId ? addReply(replyTargetId) : addComment();
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default PostDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 8,
  },
  authorRow: {
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    width: '90%',
    marginTop: 40,
    alignSelf: 'center',
  },
  editButtonGroup: {
    flexDirection: 'row',
    gap: 5,
    marginLeft: 60,
  },
  smallButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ADADAD',
  },
  smallButtonText: {
    fontSize: 13,
    color: '#ADADAD',
  },
  postCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  authorCard: {
    flexDirection: 'row',
    gap: 8,
  },
  author: {
    color: '#3E247C',
    fontSize: 18,
  },
  dateText: {
    color: '#B5B2B2',
    fontSize: 12,
    top: 4,
  },
  postTitle: {
    color: '#7242E2',
    fontSize: 19,
    marginTop: 16,
  },
  divider: {
    borderWidth: 0.5,
    borderColor: '#B5B2B2',
    width: '100%',
    alignSelf: 'center',
    marginVertical: 17,
  },
  postContent: {
    color: '#3E247C',
    fontSize: 16,
    fontFamily: 'Freesentation-6SemiBold',
  },
  editContentInput: {
    minHeight: 100,
    width: '100%',
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#ADADAD',
    fontFamily: 'Freesentation-6SemiBold',
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
    // borderBottomWidth: 0.8,
    // borderBottomColor: "#ADADAD",
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

  // 댓글 입력창 input card
  inputCard: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ADADAD',
    borderRadius: 20,
    width: '90%',
    alignItems: 'center',
    padding: 12,
    // gap: 45,
    justifyContent: 'space-between',
  },
  isAnonymousButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 8,
  },
  isAnonymousIcon: {
    width: 22,
    height: 22,
    // marginLeft: 5,
  },
  isAnonymousText: {
    fontSize: 14.5,
  },
  inputBox: {
    width: '65%',
    fontSize: 14.6,
    color: '#ADADAD',
  },
  sendIcon: {
    width: 22,
    height: 22,
    marginRight: 8,
  },
});
