import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

const hide = (dom, component, doHide, e) => {
  const notTarget = e.target !== dom;
  const notChildOfTarget = $.makeArray($(e.target).parents()).every((i) => i !== dom);
  if (notTarget && notChildOfTarget) {
    doHide(component);
  }
};
export default (doHide) => {
  return (FloatComponent) => {
    class ComponentClass extends FloatComponent {
      __documentBodySupscription = null

      componentDidMount() {
      	if (super.componentDidMount) {
      		super.componentDidMount();
      	}
      	this.__documentBodySupscription = hide.bind(null, ReactDOM.findDOMNode(this), this, doHide);
      	document.body.addEventListener('click', this.__documentBodySupscription, false);
      }

      componentWillUnmount() {
      	document.body.removeEventListener('click', this.__documentBodySupscription);
      	if (super.componentWillUnmount) {
      		super.componentWillUnmount();
      	}
      }
    }
    ComponentClass.displayName = `(clickOutside)${FloatComponent.displayName || FloatComponent.name}`;
    return ComponentClass;
  };
};
