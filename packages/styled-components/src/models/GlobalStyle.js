// @flow
import flatten from '../utils/flatten';
import isStaticRules from '../utils/isStaticRules';
import StyleSheet from '../sheet';

import type { RuleSet } from '../types';

export default class GlobalStyle {
  componentId: string;

  isStatic: boolean;

  rules: RuleSet;

  constructor(rules: RuleSet, componentId: string) {
    this.rules = rules;
    this.componentId = componentId;
    this.isStatic = isStaticRules(rules);
  }

  createStyles(instance: string, executionContext: Object, styleSheet: StyleSheet) {
    const flatCSS = flatten(this.rules, executionContext, styleSheet);
    const css = styleSheet.options.stringifier(flatCSS.join(''), '');
    const id = this.componentId + instance;

    // NOTE: We use the id as a name as well, since these rules never change
    styleSheet.insertRules(id, id, css);
  }

  removeStyles(instance: string, styleSheet: StyleSheet) {
    styleSheet.clearRules(this.componentId + instance);
  }

  renderStyles(instance: string, executionContext: Object, styleSheet: StyleSheet) {
    StyleSheet.registerId(this.componentId + instance);

    // NOTE: Remove old styles, then inject the new ones
    this.removeStyles(instance, styleSheet);
    this.createStyles(instance, executionContext, styleSheet);
  }
}
