import gql from 'graphql-tag';

import MESSAGE_FRAGMENT from './message.fragment';

const CREATE_MESSAGE_MUTATION = gql `
    mutation createMutation($text: String!, $userId: Int!, $groupID: Int!) {
        createMessage(text: $text, userId: $userId, groupId: $groupId) {
            ...MessageFragment
        }
    }  
    ${MESSAGE_FRAGMENT}
`;

export default CREATE_MESSAGE_MUTATION;