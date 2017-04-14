// React
import React, { Component, PropTypes } from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList
} from 'react-native';

// Only non-native dependency
import Image from 'react-native-image-progress';

const giphyKey = '&api_key=dc6zaTOxFJmzC';
const endPoint = 'https://api.giphy.com/v1/gifs/search?q=';

export default class GifScroller extends Component {
  constructor(props){
    super(props);
    this.state = {
      gifs: []
    }
  }
  componentDidMount = () => {
    if(this.props.inputText===""){
      var url='https://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC';
      this.fetchAndRenderGifs(url);
    }else{
      const searchTerm= this.props.inputText;
      const url = `${endPoint}${searchTerm}${giphyKey}`
      this.fetchAndRenderGifs(url);
    }
  }
  componentWillReceiveProps = (nextProps) => {
    this.setState({text: nextProps.inputText});
    if(nextProps.inputText===""){
      this.fetchAndRenderGifs('https://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC');
    } else {
      const searchTerm= nextProps.inputText;
      var url = `${endPoint}${searchTerm}${giphyKey}`;
      this.fetchAndRenderGifs(url);
    }
  }
  handleInputChange = async(text) => {
    const searchTerm= text;
    const url = `${endPoint}${searchTerm}${giphyKey}`
    this.fetchAndRenderGifs(url);
  }
  handleGifSelect = (index, url) => {
    if(this.props.handleGifSelect){
      this.props.handleGifSelect(url);
    } return;
  }
  loadMoreImages = (number) => {
    console.log('load more images', number)
    this.fetchAndRenderGifs('https://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC');
  }
  render() {
    const imageList = this.state.gifs.map((gif, index) =>
      <TouchableOpacity onPress={() => this.handleGifSelect(index, gif)} key={gif} index={index}>
        <Image
        source={{uri:gif}}
        style={styles.image}
        onLoadStart={() => <ActivityIndicator style={styles.image} animating={true}/>}
        />
      </TouchableOpacity>
    );
    return (
        <View style={this.props.style} >
          <FlatList
            horizontal={true}
            style={styles.scroll}
            data={imageList}
            renderItem={({item}) => item }
            onEndReached={this.loadMoreImages}
            onEndReachedThreshold={0}
            initialNumToRender={5}
          />
        </View>
    );
  }
  fetchAndRenderGifs = async(url, searchTerm) => {
      try{
        let response = await fetch(url);
        let gifs = await response.json();
        let gifsUrls = gifs.data.map((gif) => {
          return gif.images.fixed_height_downsampled.url;
        });
        this.setState({ gifs: gifsUrls });
      }catch(e){
        console.log(e)
      };
    };

};

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
