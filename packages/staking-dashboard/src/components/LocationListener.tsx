import PropTypes from 'prop-types';
import { Component } from 'react';

export interface ILocationListenerProps {
  doNetworkConnect: (destinationAbbr: string) => void;
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

  public handleLocationChange = (doNetworkConnect: (destinationAbbr: string) => void) => (location: any) => {
    // if (location.pathname.startsWith("/borrow/")) {
    //   if (!StakingProvider.Instance.contractsSource || !StakingProvider.Instance.contractsSource.canWrite) {
    //     doNetworkConnect("b");
    //   }
    // }
    //
    // if (location.pathname.startsWith("/dashboard/")) {
    //   if (!StakingProvider.Instance.contractsSource || !StakingProvider.Instance.contractsSource.canWrite) {
    //     doNetworkConnect("t");
    //   }
    // }

    // console.log(`location`, location.pathname);
  };

  public render() {
    return this.props.children;
  }
}    
