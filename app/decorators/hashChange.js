import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

const remove = (dom, component, currentHash, doChange, e) => {
  doChange(dom, component, currentHash, e);
};
export default (doChange) => {
  return (FloatComponent) => {
    class ComponentClass extends FloatComponent {
      __windowSupscription = null

      componentDidMount() {
      	if (super.componentDidMount) {
      		super.componentDidMount();
      	}
      	this.__windowSupscription = remove.bind(null, ReactDOM.findDOMNode(this), this, window.location.hash, doChange);
      	this.bind = function () { window.addEventListener('hashchange', this.__windowSupscription); };
      	this.unbind = function () { window.removeEventListener('hashchange', this.__windowSupscription); };

      	this.bind();
      }

      componentWillUnmount() {
      	this.unbind();
      	if (super.componentWillUnmount) {
      		super.componentWillUnmount();
      	}
      }
    }
    ComponentClass.displayName = `${FloatComponent.displayName || FloatComponent.name} (hashChange)`;
    return ComponentClass;
  };
};
