import React, { Component } from "react";
export interface ILoaderProps { }

interface ILoaderState { }

export class Loader extends Component<ILoaderProps, ILoaderState> {
    public render() {
        return (
            <div className="loader">
                <div className="loader-content">
                    <p className="loader-text">Loading</p>
                    <div className="loader-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        );
    }
}