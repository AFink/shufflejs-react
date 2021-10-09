import { assert } from 'chai';
import { jsUcfirst, stripTags } from '../src/Utils';

describe('Utils', () => {
  it('should capitalie first letter of string', () => {
    assert(jsUcfirst('test') === 'Test', 'did not capitalize');
  });

  it('should remove html tags from string', () => {
    assert(stripTags('<p>test</p>') === 'test', 'did not remove tags');
  });
});
