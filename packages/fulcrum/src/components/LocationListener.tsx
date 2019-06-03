import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FulcrumProvider } from "../services/FulcrumProvider";

export interface ILocationListenerProps {
  doNetworkConnect: () => void;
}

export class LocationListener extends Component<ILocationListenerProps> {
  public static contextTypes = {
    router: PropTypes.object
  };

  public componentDidMount(): void {
    this.context.router.history.unlisten = this.context.router.history.listen(this.handleLocationChange(this.props.doNetworkConnect));
  }

  public componentWillUnmount(): void {
    this.context.router.history.unlisten();
  }

  public handleLocationChange = (doNetworkConnect: () => void) => (location: any) => {
    if (location.pathname === "/lend" || location.pathname === "/trade") {
      if (!FulcrumProvider.Instance.contractsSource || !FulcrumProvider.Instance.contractsSource.canWrite) {
        doNetworkConnect();
      }
    }
    // console.log(`location`, location.pathname);
  }

  public render() {
    return this.props.children;
  }
}    
