import React from 'react'

import { IconChevronRight } from './../icons'

class DependencyGroup extends React.Component {
  constructor() {
    super()
    this.state = {
      showGroupItems: {},
    }
  }

  toggleGroupItems = groupId => {
    const currentToggleStateForGroup = this.getCurrentStateForGroupId(groupId)
    const newToggleState = currentToggleStateForGroup ? false : true

    const newState = { ...this.state.showGroupItems }
    newState[groupId] = newToggleState

    this.setState({
      showGroupItems: newState,
    })
  }

  getCurrentStateForGroupId(groupId) {
    return this.state.showGroupItems[groupId]
  }

  checkIfKeyWasEnterOrSpaceAndToggle = (event, groupId) => {
    event.stopPropagation()
    var keyPressed = event.key
    if (keyPressed === 'Enter' || keyPressed === ' ') {
      event.preventDefault()
      this.toggleGroupItems(groupId)
    }
  }

  onClick = event => {
    const target = event.target
    const item = this.props.dependencyGroup.children.find(
      item => item.id === target.value
    )
    if (target.checked) {
      this.props.addDependency(item)
    } else {
      this.props.removeDependency(item)
    }
  }
  renderGroupItems(group, select) {
    if (this.getCurrentStateForGroupId(group.group)) {
      return (
        <div className='group-items' key={`links${group.group}`}>
          {group.children.map(dep => (
            <a
              href='/'
              onClick={event => {
                event.preventDefault()
                if (!dep.valid) {
                  return
                }
                this.onClick({
                  target: {
                    value: dep.id,
                    checked: !select[dep.id] === true,
                  },
                })
              }}
              tabIndex={!dep.valid ? -1 : ''}
              className={`${!dep.valid ? 'invalid' : ''} ${
                select[dep.id] === true ? 'checked' : ''
              }`}
              key={dep.id}
            >
              <input
                type='checkbox'
                value={dep.id}
                key={`ck${dep.id}`}
                checked={select[dep.id] === true}
                disabled={!dep.valid}
                onChange={this.onClick}
              />
              <strong>{dep.name}</strong>
              {dep.valid && <span>{dep.description}</span>}
              {!dep.valid && (
                <div className='warning' key={`warning${dep.id}`}>
                  Requires Spring Boot {dep.versionRequirement}.
                </div>
              )}
            </a>
          ))}
        </div>
      )
    } else {
      return <div />
    }
  }

  setGroupLabel(group) {
    let numberOfSlectedItemsForGroup = 0
    group.children.forEach(dependency => {
      if (this.props.selectedDependencies[dependency.id] === true) {
        numberOfSlectedItemsForGroup++
      }
    })
    if (numberOfSlectedItemsForGroup > 0) {
      return (
        <span className='group-label'>
          {group.group} ( {numberOfSlectedItemsForGroup} selected )
        </span>
      )
    } else {
      return <span className='group-label'>{group.group}</span>
    }
  }

  render() {
    const group = this.props.dependencyGroup
    console.log(group)
    const select = this.props.select
    return (
      <div className='group'>
        <div className='group-title'>
          <span
            onClick={() => this.toggleGroupItems(group.group)}
            className={
              this.state.showGroupItems[group.group] ? 'toggleGroupItems' : ''
            }
            tabIndex={0}
            onKeyDown={event =>
              this.checkIfKeyWasEnterOrSpaceAndToggle(event, group.group)
            }
          >
            <IconChevronRight />

            {this.setGroupLabel(group)}
          </span>
        </div>
        {this.renderGroupItems(group, this.props.selectedDependencies)}
      </div>
    )
  }
}

export default DependencyGroup
