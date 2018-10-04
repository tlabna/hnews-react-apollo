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

  render() {
    return (
      <Query query={FEED_QUERY}>
        {({ loading, error, data }) => {
          if (loading) return <div>Fetching</div>
          if (error) return <div>Error</div>

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
