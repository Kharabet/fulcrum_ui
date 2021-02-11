import React from 'react'
import * as mobxReact from 'mobx-react'

interface IComponentWithVMProps {
  vm: any | undefined
  [x: string]: any
}

interface IProviderProps {
  [x: string]: any
  rootStore?: any
}

/**
 * Tries to determine a Component's name
 * @param {function} Component
 */
function getComponentDisplayName(Component: React.ComponentType<IComponentWithVMProps>) {
  return (
    Component.displayName ||
    Component.name ||
    (Component.constructor && Component.constructor.name) ||
    'Unknown'
  )
}

/**
 * `withVM` is a higher order component that allows to easily keep separated
 * the definition of a component internal state and its actual view (render) part.
 *
 * Thinking in terms of React/Mobx patterns,
 * it can be viewed as a convenient HOC that creates "smart" or "container" components with extras.
 *
 * As a reminder, a `vm` or view-model, is an entity responsible for taking the system business
 * data and use cases and make them available to a user interface, such as a view.
 * In general, using these VM is recommended for top-level sections such as feature pages
 * or stand-alone "widgets".
 *
 * What `withVM` does technically:
 * - it turns the component it receives as first argument into mobx Observer.
 * - it instantiates a VM when the component is mounted and pass it to the component.
 * - the VM receives the mobx rootStore so that your app state is available to your UI (Component)
 *
 * Usage example:
 * - The business data and logic is available through a "root store".
 *   [Mobx docs](https://mobx.js.org/defining-data-stores.html#combining-multiple-stores)
 * - This root store is provided as a prop called "rootStore" in React Context.
 *   For example using mobx-react Provider: `<Provider rootStore={rootStore}><App/></Provider>`
 * - Design the VM with the following characteristics:
 *   - the VM constructor expects an object as argument, one property being `rootStore`.
 *   - if necessary, a `destroyVM` method can be defined for cleanup. (automatically called on unmount)
 *
 * Pseudo code snippets:
 * ```
 * // UserFormComponent.js
 * function UserFormComponent (props) {
 *   const {vm} = props
 *   return (
 *     <div>
 *       <input value={vm.name}/>
 *       <input value={vm.email}/>
 *     </div>
 *   )
 * }
 *
 * // ----------------
 * // UserFormWithVM.js
 * import withVM from '*...*withVM'
 * import UserFormComponent from './UserFormComponent'
 *
 * class UserFormVM {
 *   @observable name = ''
 *   @observable email = ''
 *
 *   @action.bound set (prop, value) {
 *     this[prop] = value
 *   }
 *
 *   destroyVM () {
 *     // can be optionally defined if cleanup necessary
 *   }
 *
 *   constructor ({rootStore}) {
 *     // do something with rootStore
 *   }
 * }
 *
 * export default withVM(UserFormComponent, UserForm)
 *
 * // ----------------
 * // App
 * import UserFormVM from './UserFormVM'
 * function App {
 *   return (
 *     <div>
 *       <UserFormWithVM/>
 *     </div>
 *   )
 * }
 * ```
 * @param Component
 * @param VM local vm using mobx observables
 */
export default function withVM(Component: React.ComponentType<IComponentWithVMProps>, VM: any) {
  const ObserverComponent = mobxReact.observer(Component)

  const VMProvider = (props: IProviderProps) => {
    const { rootStore, ...otherProps } = props
    const [vm] = React.useState(() => new VM(props))
    React.useEffect(() => () => {
      if (typeof vm.destroyVM === 'function') {
        vm.destroyVM()
      }
    })
    return <ObserverComponent vm={vm} {...otherProps} />
  }
  VMProvider.displayName = `${getComponentDisplayName(Component)}WithVM`
  return mobxReact.inject('rootStore')(React.memo(VMProvider))
}
