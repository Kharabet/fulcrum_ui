import React, { Component } from "react";
interface ILoaderProps { }

interface ILoaderState { }

export class LoaderData extends Component<ILoaderProps, ILoaderState> {
    public render() {
        return (
            <div className="loader-dots">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        );
    }
}