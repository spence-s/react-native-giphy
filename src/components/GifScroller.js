import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList
} from 'react-native';
import Image from 'react-native-image-progress';
import qs from 'qs';
import _ from 'lodash';

const baseEndPoint = 'https://api.giphy.com/v1/gifs/';

export default class GifScroller extends Component {
  static defaultProps = {
    apiKey: '',
    inputText: '',
    handleGifSelect: () => {},
    style: {},
    rating: '',
    lang: 'en',
    randomID: ''
  }

  constructor (props) {
    super (props);
    this.state = {
      gifs: [],
      offset: 0
    }
    this.emitSearchTermChange = _.debounce(({searchTerm, apiKey, limit, offset, rating, lang, randomID}) => {
      this.fetchAndRenderGifs({searchTerm, apiKey, limit, offset, rating, lang, randomID});
    }, 1000);
  }



  componentDidMount = () => {
    const { apiKey } = this.props;
    const searchTerm = this.props.inputText;
    this.onSearchTermChange({searchTerm, apiKey});
  }

  componentWillReceiveProps = (nextProps) => {
    const { apiKey } = nextProps;
    this.setState({ offset: 0 });
    const searchTerm= nextProps.inputText;
    this.onSearchTermChange({searchTerm, apiKey});
  }

  onSearchTermChange({searchTerm, apiKey}) {
    this.emitSearchTermChange({searchTerm, apiKey});
  }

  handleGifSelect = (index, url) => {
    if (this.props.handleGifSelect){
      this.props.handleGifSelect(url);
    }
  }

  loadMoreImages = () => {
    this.setState({offset: this.state.offset + 10}, () => {
      const {inputText: searchTerm, apiKey} = this.props;
      const {offset} = this.state;
      this.emitSearchTermChange({searchTerm, apiKey, limit: 5, offset}).catch(e => console.warn(e));
    });
  }

  render() {
    const imageList = _.map(this.state.gifs,(gif, index) =>
      <TouchableOpacity onPress={() => this.handleGifSelect(index, gif)} key={index} index={index}>
        <Image
          source={ { uri:gif } }
          style={ styles.image }
        />
      </TouchableOpacity>
    );
    return (
      <View style={this.props.style} >
        <FlatList
          horizontal={true}
          style={styles.scroll}
          data={imageList}
          renderItem={({ item }) => item }
          onEndReached={this.loadMoreImages}
          onEndReachedThreshold={500}
          initialNumToRender={4}
          keyboardShouldPersistTaps={'always'}
        />
      </View>
    );
  }

  buildUrl = ({apiKey = '', searchTerm, limit = 5, offset = 0, rating, lang, randomID}) => {
    let endpoint = searchTerm ? 'search' : 'trending';
    const queryObj = { api_key: apiKey, limit, offset };
    if (searchTerm) queryObj.q = searchTerm;
    if (rating) queryObj.rating = rating;
    if (lang) queryObj.lang = lang;
    if (randomID) queryObj.random_id = randomID;
    let query = qs.stringify(queryObj);
    return `${baseEndPoint}${endpoint}?${query}`;
  }

  fetchAndRenderGifs = async ({searchTerm, apiKey, limit, offset, rating, lang, randomID}) => {
    const url = this.buildUrl({searchTerm, apiKey, limit, offset, rating, lang, randomID});
    try {
      let response = await fetch(url);
      let res = await response.json();
      let gifsUrls = _.map(res.data, (gif) => {
        return _.get(gif, 'images.fixed_height_downsampled.url');
      });
      let newGifsUrls = this.state.gifs.concat(gifsUrls);
      const offset = _.get(res, 'pagination.offset') || this.state.offset;
      this.setState({ gifs: newGifsUrls, offset });
    } catch (e) {
      console.log(e);
    }
  };

}

const styles = StyleSheet.create({
  scroll: {
    height: 100,
  },
  image:{
    width: 100,
    height: 100,
    borderRadius: 2,
    marginRight: 1
  }
});
