import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList
} from 'react-native';

import Image from 'react-native-image-progress';
import qs from 'qs';
const giphyKey = '&api_key=dc6zaTOxFJmzC';

const api_key = 'dc6zaTOxFJmzC';
const endPoint = 'https://api.giphy.com/v1/gifs/search?q=';

export default class GifScroller extends Component {
  constructor (props) {
    super (props);
    this.state = {
      gifs: [],
      offset: 0
    }
  }

  

  componentDidMount = () => {
    if (this.props.inputText === '') {
      this.buildUrl('trending',api_key);
    } else {
      const searchTerm= this.props.inputText;
      this.buildUrl('search',api_key, searchTerm,5);
    }
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({ gifs: [], offset: 0 });
    if (nextProps.inputText==='') {
      this.buildUrl('trending',api_key);
    } else {
      const searchTerm= nextProps.inputText;
      this.buildUrl('search',api_key,searchTerm,5)
    }
  }

  handleGifSelect = (index, url) => {
    if (this.props.handleGifSelect){
      this.props.handleGifSelect(url);
    }
  }

  loadMoreImages = (number) => {
    this.state.offset += 10;
    this.buildUrl('search',api_key,this.props.inputText,5,this.state.offset);
  }

  render() {
    const imageList = this.state.gifs.map((gif, index) =>
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

  buildUrl = (endpoint, api_key, q, limit, offset) => {
    if (endpoint === 'trending'){
      let endpoint = 'https://api.giphy.com/v1/gifs/trending?api_key='
      const url = `${endpoint}${api_key}`
      this.fetchAndRenderGifs(url);
    }
    else {
      let endpoint = 'https://api.giphy.com/v1/gifs/search?';
      let query = qs.stringify({ q, api_key,limit, offset });
      const url = `${endpoint}${query}`;
      this.fetchAndRenderGifs(url);
    }
  }

  fetchAndRenderGifs = async(url) => {
    try{
      let response = await fetch(url);
      let gifs = await response.json();
      let gifsUrls = gifs.data.map((gif) => {
        return gif.images.fixed_height_downsampled.url;
      });
      let newGifsUrls = this.state.gifs.concat(gifsUrls);
      this.setState({ gifs: newGifsUrls });
    } catch (e) {
        console.log(e);
    }
  };

}

GifScroller.defaultProps ={
  inputText: ''
};

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
