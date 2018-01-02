import { put, select, takeLatest } from 'redux-saga/effects';
import update from 'immutability-helper';
import draftToHtml from 'draftjs-to-html';
import steemconnect from 'sc2-sdk';
import { createPermlink } from 'utils/helpers/steemitHelpers';
import { selectMyAccount } from 'features/User/selectors';

import { notification } from 'antd';

import api from 'utils/api';


/*--------- CONSTANTS ---------*/
const PUBLISH_CONTENT_BEGIN = 'PUBLISH_CONTENT_BEGIN';
const PUBLISH_CONTENT_SUCCESS = 'PUBLISH_CONTENT_SUCCESS';
const PUBLISH_CONTENT_FAILURE = 'PUBLISH_CONTENT_FAILURE';
const PUBLISH_ON_BLOCKCHAIN_FAILURE = 'PUBLISH_ON_BLOCKCHAIN_FAILURE';

/*--------- ACTIONS ---------*/

export function publishContentBegin(post) {
  return { type: PUBLISH_CONTENT_BEGIN, post };
}

export function publishContentSuccess() {
  return { type: PUBLISH_CONTENT_SUCCESS };
}

export function publishContentFailure(message) {
  return { type: PUBLISH_CONTENT_FAILURE, message };
}

/*--------- REDUCER ---------*/
export function publishContentReducer(state, action) {
  switch (action.type) {
    case PUBLISH_CONTENT_BEGIN: {
      return update(state, {
        isPublishing: {$set: true},
      });
    }
    case PUBLISH_CONTENT_SUCCESS: {
      return update(state, {
        isPublishing: {$set: false},
        // publishFormOpen: {$set: false}, // TODO: Redirect to the article
      });
    }
    default:
      return state;
  }
}

// function* publishOnBlockchain(post) {
//   try {
//     const myAccount = yield select(selectMyAccount());
//     const { title, tags, editorRaw } = post;
//     const author = myAccount.name;
//     const parentPermlink = tags.length ? tags[0] : 'general';
//     const permlink = yield createPermlink(title, author, parentPermlink, tags[0]);
//     const metadata = {
//       app: 'steemhunt',
//     };

//     // Listing images and links
//     const images = [];
//     const links = [];
//     Object.values(editorRaw.entityMap).forEach(entity => {
//       if (entity.type === 'IMAGE') {
//         images.push(entity.data.src);
//       }
//       if (entity.type === 'LINK') {
//         links.push(entity.data.url);
//       }
//     });
//     if (tags.length) { metadata.tags = tags; }
//     if (links.length) { metadata.links = links; }
//     if (images.length) { metadata.image = images; }

//     const operations = [];
//     const commentOp = [
//       'comment',
//       {
//         parent_author: '',
//         parent_permlink: parentPermlink,
//         author,
//         permlink,
//         title,
//         body: draftToHtml(editorRaw),
//         json_metadata: JSON.stringify(metadata),
//       },
//     ];
//     operations.push(commentOp);


//     // SP / SBD is always 50:50

//     // const commentOptionsConfig = {
//     //   author,
//     //   permlink,
//     //   allow_votes: true,
//     //   allow_curation_rewards: true,
//     // };
//     // const { reward } = post;
//     // if (reward === '0') {
//     //   commentOptionsConfig.max_accepted_payout = '0.000 SBD';
//     //   commentOptionsConfig.percent_steem_dollars = 10000;
//     // } else if (reward === '100') {
//     //   commentOptionsConfig.max_accepted_payout = '1000000.000 SBD';
//     //   commentOptionsConfig.percent_steem_dollars = 0;
//     // }
//     // if (reward !== '50') {
//     //   operations.push(['comment_options', commentOptionsConfig]);
//     // }

//     yield steemconnect.broadcast(operations);
//     yield put(publishContentSuccess());
//     yield put(notification['success']({ message: 'Congratulations! Your post has been successfully published!' }));
//   } catch (e) {
//     yield put(publishContentFailure(e.message));
//   }
// }

/*--------- SAGAS ---------*/
/**
 * @param post: { title: string, tags: array, editorRaw }
 */
function* publishContent({ post }) {
  console.log('1------', post);
  api.post('/posts.json', { post: post }).then((res) => {
    console.log('res------', res);

    // TODO: Publish on Blockchain begin


  }).catch(msg => {
    notification['error']({ message: 'ERROR', description: msg });
  });
}

export default function* publishContentManager() {
  yield takeLatest(PUBLISH_CONTENT_BEGIN, publishContent);
}
