import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Shuffle from 'shufflejs';
import SortButtons from './SortButtons';

class Core extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // taxonomies: {},
      taxonomiesBodyTypeNames: []
    };
    this.element = React.createRef();
    this.sizer = React.createRef();
  }

  UNSAFE_componentWillMount() {
    /**
     * Kick off the network request and update the state once it returns.
     */
    const { taxonomies } = this.props;
    this._loadProps()
      .then(() => {
        this.setState({
          // taxonomies,
          taxonomiesBodyTypeNames: Object.keys(taxonomies['Body Types'])
        });
      });
  }

  componentDidMount() {
    const options = {
      // reverse: true,
      by: this._byFunction
    };
    const { itemSelector } = this.props;
    this.shuffle = new Shuffle(this.element.current, {
      itemSelector: `.${itemSelector}`,
      sizer: this.sizer.current,
      initialSort: options,
      speed: 750,
    });
    // this.sortFromUrlSearch();
  }

  componentDidUpdate() {
    // Notify shuffle to dump the elements it's currently holding and consider
    // all elements matching the `itemSelector` as new.
    this.shuffle.resetItems();
  }

  componentWillUnmount() {
    // Dispose of shuffle when it will be removed from the DOM.
    this.shuffle.destroy();
    this.shuffle = null;
  }

  _byFunction = (element) => {
    const { defaultSort } = this.props;
    const dataGroups = element.getAttribute('data-groups');// array string
    const dataArray = JSON.parse(dataGroups);// array
    // const defaultValue = dataArray.find((value) => {return value === this.props.defaultSort;});
    const defaultValue = dataArray.find((value) => value === defaultSort);
    // console.log('defaultValuess', defaultValue)

    return defaultValue;
  }

  /**
   * Sort by the text node within the targeted element
   * @param {Object} e to the event target of the element
   */
  sortByName = (e) => {
    e.preventDefault();

    const filter = e.target.textContent;
    this.toggleActiveClasses(e, filter);

    return this.shuffle.filter(filter);
  };

  toggleActiveClasses = (event, filter) => {
    const buttons = event.target.parentNode.parentNode.children;

    for (const button of buttons) {
      if (button.childNodes[0].innerHTML.toLowerCase() === filter.toLowerCase()) {
        button.childNodes[0].classList.add('active');
      } else {
        button.childNodes[0].classList.remove('active');
      }
    }
  }

  /**
   * Show all elements using shufflejs provided string
   * @param {Object} e to the event target of the element
   */
  sortAll = (e) => {
    e.preventDefault();

    const filter = Shuffle.ALL_ITEMS;
    this.toggleActiveClasses(e, filter);

    this.shuffle.filter(filter);
  }

  /**
   * Set delay
   * @return {Promise<Object[]>} A promise which resolves with an array of objects.
   */
  _loadProps() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.props);
      }, 500);
    });
  }

  render() {
    const { taxonomiesBodyTypeNames } = this.state;
    const { children, itemSelector, sortAllText = 'All' } = this.props;
    return (
      <div className="sort-mainblock">
        <div className="sort-mainblock__sorting">
          <div className="row">
            <SortButtons onClickByName={this.sortByName} onClickAll={this.sortAll} taxonomies={taxonomiesBodyTypeNames} allTrue sortAllText={sortAllText} />
          </div>
        </div>
        <div ref={this.element} className="row" classtosort={itemSelector}>
          {children}
          <div ref={this.sizer} className="col-sm-1 col-1@xs col-1@sm sort-mainblock__sizer" />
        </div>
      </div>
    );
  }
}

export default Core;

Core.propTypes = {
  defaultSort: PropTypes.string.isRequired,
  // taxonomies: PropTypes.arrayOf(PropTypes.object).isRequired,
  taxonomies: PropTypes.objectOf(PropTypes.object).isRequired,
  itemSelector: PropTypes.string.isRequired,
  sortAllText: PropTypes.string,
  // children: PropTypes.element.isRequired
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.array,
  ]).isRequired
};
Core.defaultProps = {
  sortAllText: 'All',
};
