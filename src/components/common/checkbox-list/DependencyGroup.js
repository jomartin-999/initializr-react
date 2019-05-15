import React from 'react'

import DependencyItem from './DependencyItem'
import { IconChevronRight } from './../icons'

class DependencyGroup extends React.Component {
  constructor() {
    super()
    this.state = {
      showGroupItems: false,
    }
  }

  toggleGroupItems() {
    this.setState({
      showGroupItems: !this.state.showGroupItems,
    })
  }

  checkIfKeyWasEnterOrSpaceAndToggle = (event, groupId) => {
    event.stopPropagation()
    var keyPressed = event.key
    if (keyPressed === 'Enter' || keyPressed === ' ') {
      event.preventDefault()
      this.toggleGroupItems(groupId)
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
    const selectedDependencies = this.props.selectedDependencies
    return (
      <div className='group'>
        <div className='group-title'>
          <span
            onClick={() => this.toggleGroupItems()}
            className={this.state.showGroupItems ? 'toggleGroupItems' : ''}
            tabIndex={0}
            onKeyDown={event =>
              this.checkIfKeyWasEnterOrSpaceAndToggle(event, group.group)
            }
          >
            <IconChevronRight />

            {this.setGroupLabel(group)}
          </span>
        </div>
        {this.state.showGroupItems && (
          <div className='group-items' key={`links${group.group}`}>
            {group.children.map(dep => (
              <DependencyItem
                key={dep.id}
                dep={dep}
                selectedDependencies={selectedDependencies}
                addDependency={this.props.addDependency}
                removeDependency={this.props.removeDependency}
              />
            ))}
          </div>
        )}
      </div>
    )
  }
}

export default DependencyGroup
