import FileSaver from 'file-saver'
import React from 'react'
import get from 'lodash.get'
import querystring from 'querystring'
import set from 'lodash.set'
import { graphql } from 'gatsby'

import { CheckboxList } from '../components/common/checkbox-list'
import { Footer, Layout } from '../components/common/layout'
import { List, RadioGroup } from '../components/common/form'
import { Meta } from '../components/common/meta'
import { Typehead } from '../components/common/typehead'

class IndexPage extends React.Component {
  constructor(props) {
    super(props)
    const data = this.props.data.allContentJson.edges[0].node
    let values = { ...data.default }
    set(values, 'meta.name', get(data, 'default.meta.artifact'))
    set(
      values,
      'meta.packageName',
      `${get(data, 'default.meta.group')}.${get(data, 'default.meta.artifact')}`
    )
    this.state = {
      dependencies: [],
      toggleDependency: false,
      more: false,
      form: props.data.default,
      ...values,
    }
  }

  dependencyAdd = dependency => {
    console.log('Add: ' + dependency.id)
    this.setState({ dependencies: [...this.state.dependencies, dependency] })
  }

  dependencyRemove = dependency => {
    console.log('Remove: ' + dependency.id)
    this.setState({
      dependencies: this.state.dependencies.filter(
        item => dependency.name !== item.name
      ),
    })
  }

  toggle = event => {
    event.preventDefault()
    this.setState({ more: !this.state.more })
  }

  toggleDependency = event => {
    event.preventDefault()
    this.setState({ toggleDependency: !this.state.toggleDependency })
  }

  updateMetaState = (prop, value) => {
    let meta = { ...this.state.meta }
    meta[prop] = value
    this.setState({ meta: meta })
  }

  onSubmit = event => {
    event.preventDefault()
    const { project, language, boot, meta, dependencies } = this.state
    const url = 'http://localhost:8080/starter.zip'
    const params = querystring.stringify({
      type: project,
      language: language,
      bootVersion: boot,
      baseDir: meta.artifact,
      groupId: meta.group,
      artifactId: meta.artifact,
      name: meta.name,
      description: meta.description,
      packageName: meta.packageName,
      packaging: meta.packaging,
      javaVersion: meta.java,
    })
    const paramsDependencies = dependencies
      .map(dep => `&style=${dep.id}`)
      .join('')
    fetch(`${url}?${params}${paramsDependencies}`, { method: 'GET' })
      .then(
        function(response) {
          if (response.status === 200) {
            return response.blob()
          }
          // Handle Error
          console.log(response)
        },
        function(error) {
          // Handle Error
          console.log(error)
        }
      )
      .then(function(blob) {
        const fileName = `${meta.artifact}.zip`
        FileSaver.saveAs(blob, fileName)
      })
  }

  render() {
    const data = this.props.data.allContentJson.edges[0].node
    return (
      <Layout>
        <Meta />
        <form onSubmit={this.onSubmit}>
          <div className='colset'>
            <div className='left'>Project</div>
            <div className='right'>
              <RadioGroup
                name='project'
                selected={this.state.project}
                options={data.project}
                onChange={value => {
                  this.setState({ project: value })
                }}
              />
            </div>
          </div>
          <div className='colset'>
            <div className='left'>Language</div>
            <div className='right'>
              <RadioGroup
                name='language'
                selected={this.state.language}
                onChange={value => {
                  this.setState({ language: value })
                }}
                options={data.language}
              />
            </div>
          </div>
          <div className='colset'>
            <div className='left'>Spring Boot</div>
            <div className='right'>
              <RadioGroup
                name='boot'
                selected={this.state.boot}
                options={data.boot}
                onChange={value => {
                  this.setState({ boot: value })
                }}
              />
            </div>
          </div>
          <div className='colset'>
            <div className='left'>Project Metadata</div>
            <div className='right right-md'>
              <div className='control'>
                <label>Group</label>
                <input
                  type='text'
                  className='control-input'
                  defaultValue={this.state.meta.group}
                  onChange={event => {
                    this.updateMetaState('group', event.target.value)
                  }}
                />
              </div>
              <div className='control'>
                <label>Artifact</label>
                <input
                  type='text'
                  className='control-input'
                  defaultValue={this.state.meta.artifact}
                  onChange={event => {
                    this.updateMetaState('artifact', event.target.value)
                  }}
                />
              </div>
              {this.state.more && (
                <div>
                  <div className='control'>
                    <label>Name</label>
                    <input
                      type='text'
                      className='control-input'
                      defaultValue={this.state.meta.name}
                      onChange={event => {
                        this.updateMetaState('name', event.target.value)
                      }}
                    />
                  </div>
                  <div className='control'>
                    <label>Description</label>
                    <input
                      type='text'
                      className='control-input'
                      defaultValue={this.state.meta.description}
                      onChange={event => {
                        this.updateMetaState('description', event.target.value)
                      }}
                    />
                  </div>
                  <div className='control'>
                    <label>Package Name</label>
                    <input
                      type='text'
                      className='control-input'
                      defaultValue={this.state.meta.packageName}
                      onChange={event => {
                        this.updateMetaState('packageName', event.target.value)
                      }}
                    />
                  </div>
                  <div className='control'>
                    <label>Packaging</label>
                    <div>
                      <RadioGroup
                        name='packaging'
                        selected={this.state.meta.packaging}
                        options={data.meta.packaging}
                        onChange={value => {
                          this.updateMetaState('packaging', value)
                        }}
                      />
                    </div>
                  </div>
                  <div className='control'>
                    <label>Java</label>
                    <div>
                      <RadioGroup
                        name='java'
                        selected={this.state.meta.java}
                        options={data.meta.java}
                        onChange={value => {
                          this.updateMetaState('java', value)
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className='more'>
                <div className='wrap'>
                  {!this.state.more ? (
                    <button
                      className='button'
                      type='button'
                      onClick={this.toggle}
                    >
                      More options
                    </button>
                  ) : (
                    <button
                      className='button'
                      type='button'
                      onClick={this.toggle}
                    >
                      Fewer options
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          {!this.state.toggleDependency ? (
            <div className='colset'>
              <div className='left'>
                Dependencies
                <a href='/' className='see-all' onClick={this.toggleDependency}>
                  View all
                </a>
              </div>
              <div className='dependencies'>
                <div className='colset-2'>
                  <div className='column'>
                    <label>Search dependencies to add</label>
                    <Typehead
                      boot={this.state.boot}
                      add={this.dependencyAdd}
                      options={data.dependencies}
                      exclude={this.state.dependencies}
                    />
                  </div>
                  <div className='column'>
                    {this.state.dependencies.length > 0 && (
                      <>
                        Selected dependencies
                        <List
                          boot={this.state.boot}
                          remove={this.dependencyRemove}
                          list={this.state.dependencies}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className='colset'>
              <div className='left'>
                Dependencies
                <a href='/' className='see-all' onClick={this.toggleDependency}>
                  Search
                </a>
              </div>
              <div className='dependencies'>
                <CheckboxList
                  boot={this.state.boot}
                  add={this.dependencyAdd}
                  remove={this.dependencyRemove}
                  list={data.dependencies}
                  checked={this.state.dependencies}
                />
              </div>
            </div>
          )}
          <div className='sticky'>
            <div className='colset'>
              <div className='left nopadding'>
                <Footer />
              </div>
              <div className='right nopadding'>
                <div className='submit'>
                  <button className='button primary' type='submit'>
                    Generate the project - ⌘ + ⏎
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Layout>
    )
  }
}

export const jsonObject = graphql`
  query {
    allContentJson {
      edges {
        node {
          id
          project {
            key
            text
          }
          language {
            key
            text
          }
          boot {
            key
            text
          }
          meta {
            packaging {
              key
              text
            }
            java {
              key
              text
            }
          }
          default {
            project
            language
            boot
            meta {
              group
              artifact
              description
              packaging
              java
            }
          }
          dependencies {
            id
            name
            group
            weight
            description
            versionRequirement
            versionRange
            keywords
          }
        }
      }
    }
  }
`

export default IndexPage
