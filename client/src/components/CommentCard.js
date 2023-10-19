import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function CommentCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { comment, index } = props;

    let cardClass = "list-card unselected-list-card";
    return (
        <div
            key={index}
            id={'comment-' + index + '-card'}
            className={cardClass}
        >
            <a
                id={'comment-' + index + '-link'}
                className="comment-link">
                {comment.username}:
                <br></br>
                {comment.message}
            </a>
        </div>
    );
}

export default CommentCard;