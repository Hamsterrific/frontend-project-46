import _ from 'lodash';

const indent = (depth, str = ' ') => str.repeat(depth * 4 - 2);

const stringify = (value, depth = 1) => {
  if (!_.isObject(value)) {
    return String(value);
  }
  const keys = Object.keys(value);
  const result = keys.map((key) => `${indent(depth + 1)}  ${key}: ${stringify(value[key], depth + 1)}`);
  return `{\n${result.join('\n')}\n  ${indent(depth)}}`;
};

const iter = (tree, depth = 1) => tree.map((node) => {
  switch (node.type) {
    case 'nested':
      return `${indent(depth)}  ${node.key}: {\n${iter(node.children, depth + 1)}\n${indent(depth)}  }`;
    case 'removed':
      return `${indent(depth)}- ${node.key}: ${stringify(node.value, depth)}`;
    case 'added':
      return `${indent(depth)}+ ${node.key}: ${stringify(node.value, depth)}`;
    case 'changed': {
      const output1 = `${indent(depth)}- ${node.key}: ${stringify(node.value1, depth)}`;
      const output2 = `${indent(depth)}+ ${node.key}: ${stringify(node.value2, depth)}`;
      return `${output1}\n${output2}`;
    }
    case 'unchanged':
      return `${indent(depth)}  ${node.key}: ${stringify(node.value, depth)}`;
    default: throw new Error(`Unknown type: ${node.type}`);
  }
}).join('\n');

const formatStylish = (data) => `{\n${iter(data)}\n}`;

export default formatStylish;
