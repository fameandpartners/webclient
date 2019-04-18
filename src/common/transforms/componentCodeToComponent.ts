import { Component } from '@typings';

export const componentCodeToComponent = (code: string, components: Component[] | null) => components && components.find((c) => c.code === code) || null;

export const mapComponentCodeToComponent = (components: Component[] | null) => (code: string) => components && components.find((c) => c.code === code) || null;

export default componentCodeToComponent;
