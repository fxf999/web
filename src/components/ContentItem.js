// TODO: DEPRECATE

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedRelative } from 'react-intl';

import { Icon } from 'antd';

import CircularProgress from 'components/CircularProgress';
import extractDesc from 'utils/helpers/extractDesc';
import Author from './Author';
import VoteButton from 'features/Vote/VoteButton';
import {
  calculateContentPayout,
  displayContentNbComments,
  formatAmount,
} from 'utils/helpers/steemitHelpers';

function ContentItem(props) {
  const { content, type, currentCategory } = props;
  const payout = calculateContentPayout(content);
  const splitUrl = content.url.split('#');
  const linkUrl = splitUrl[0];
  const hashUrl = splitUrl[1] ? `#${splitUrl[1]}` : '';
  const isResteemed = content.reblogged_by.length > 0;
  const resteemedBy = content.reblogged_by[0];
  return (
    <div className="post_card">
      {type === 'post' && content.main_img && (
        <Link
          to={{ pathname: linkUrl, hash: hashUrl }}
          className="post_card__block post_card__block--img"
          style={{background: `url(${content.main_img}) no-repeat #eee center center / cover`}}
        />
      )}
      <div className={`post_card__block post_card__block--content ${!content.main_img && 'full'}`}>
        <div className="title">
          <Link to={{ pathname: linkUrl, hash: hashUrl }} className="post_card__block">
            <h3>{content.title || content.root_title}</h3>
          </Link>
          {isResteemed && (
            <div className="resteemed">
              <Icon type="retweet" />
              Resteemed by {' '}<Link to={`/@${resteemedBy}`}>{resteemedBy}</Link>
            </div>
          )}
        </div>
        <Link to={{ pathname: linkUrl, hash: hashUrl }} className="post_card__block">
          <p>{extractDesc(content)}</p>
        </Link>
        <div className="post_card__block post_card__block--info">
          <div className="details">
            <VoteButton post={content} type={type} />
            <div className="price">
              {content.isUpdating && <CircularProgress size={20} style={{ marginRight: 10 }} />}
              {formatAmount(payout)}
            </div>
            <Link to="/" title="Favorites" className="social_area social_area--like">
              <Icon type="up-circle" />
              <span>{content.net_votes}</span>
            </Link>
            <Link title="Responses" to={{ pathname: linkUrl, hash: hashUrl }} className="social_area social_area--comment">
              <Icon type="message" />
              <span>{displayContentNbComments(content)}</span>
            </Link>
          </div>
          <div className="info">
            <div className="author">
              <span>by </span>
              <Author name={content.author} />
            </div>
            <div className="datetime">
              <FormattedRelative value={`${content.created}Z`} /> in <Link to={`/${currentCategory}/${content.category}`}>{content.category}</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ContentItem.defaultProps = {
  currentCategory: 'trending',
};

ContentItem.propTypes = {
  type: PropTypes.oneOf([
    'post', 'comment',
  ]).isRequired,
  content: PropTypes.object.isRequired,
  currentCategory: PropTypes.string,
};

export default ContentItem;