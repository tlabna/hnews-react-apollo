import React, { Component } from 'react'
import Link from './Link'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

export const FEED_QUERY = gql`
  {
    feed {
      links {
        id
        createdAt
        description
        url
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`

const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
      node {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`

const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVote {
      node {
        id
        link {
          id
          url
          description
          createdAt
          postedBy {
            id
            name
          }
          votes {
            id
            user {
              id
            }
          }
        }
        user {
          id
        }
      }
    }
  }
`

export default class LinkList extends Component {
  _updateCacheAfterVote = (store, createVote, linkId) => {
    // get current state of cached data for FEED_QUERY from the store
    const data = store.readQuery({ query: FEED_QUERY })

    // retrieve the link that the user just voted for from the list
    const votedLink = data.feed.links.find((link) => link.id === linkId)
    // reset votes to the votes that were just returned by the server
    votedLink.votes = createVote.link.votes

    // write modified data back into the store
    store.writeQuery({ query: FEED_QUERY, data })
  }

  _subscribeToNewLinks = (subscribeToMore) => {
    subscribeToMore({
      // This represents the subscription query itself.
      // In your case, the subscription will fire every time a new link is created
      document: NEW_LINKS_SUBSCRIPTION,
      /* Similar to cache update prop, this function allows you to determine how the store should be updated with the information that was sent by the server after the event occurred */
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        const newLink = subscriptionData.data.newLink.node

        return Object.assign({}, prev, {
          feed: {
            links: [newLink, ...prev.feed.links],
            count: prev.feed.links.length + 1,
            __typename: prev.feed.__typename,
          },
        })
      },
    })
  }

  _subscribeToNewVotes = (subscribeToMore) => {
    subscribeToMore({
      document: NEW_VOTES_SUBSCRIPTION,
    })
  }

  render() {
    return (
      <Query query={FEED_QUERY}>
        {({ loading, error, data, subscribeToMore }) => {
          if (loading) return <div>Fetching</div>
          if (error) return <div>Error</div>

          this._subscribeToNewLinks(subscribeToMore)
          this._subscribeToNewVotes(subscribeToMore)

          const linksToRender = data.feed.links

          return (
            <div>
              {linksToRender.map((link, index) => (
                <Link
                  key={link.id}
                  link={link}
                  index={index}
                  updateStoreAfterVote={this._updateCacheAfterVote}
                />
              ))}
            </div>
          )
        }}
      </Query>
    )
  }
}
