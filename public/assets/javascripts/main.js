"use strict";

$(document).ready(removeEmptyAlertsContainer);

function removeEmptyAlertsContainer(){
    const $messagesNode = $('.messages');
    if ($messagesNode.length > 0){
        const collapsibleNodeObserver = new MutationObserver(function(mutations){
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.target.children.length === 0){
                    $(mutation.target).remove();
                }
            });
            if (this.takeRecords().length === 0){
                this.disconnect();
            }
        });
        collapsibleNodeObserver.observe($messagesNode[0], {
            childList: true
        })
    }
}