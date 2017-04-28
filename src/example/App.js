import React, { Component } from 'react';
import {
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,Button
} from 'react-native';

import GifScroller from '../components/GifScroller';

class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      text: '',
      showGif: false,
    };
  }
  renderGif = () => {
    if(this.state.showGif){
      return (
        <GifScroller
          inputText={this.state.text}
        />)
    }else{return}
  }
  render(){
    return(
      <KeyboardAvoidingView behavior={'padding'} style={styles.container}>
        {this.renderGif()}
        <TextInput
          onChangeText={(text) => {this.setState( { text })}}
          value={this.state.text}
          style={styles.input}/>
          <Button
            title={'Show Gif Scroller'}
            onPress={() => {
              this.setState({ showGif: !this.state.showGif } )
            }}
          />
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  input:{
    height: 40
  }
});

export default App;
