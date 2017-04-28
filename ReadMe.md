# React Native Giphy

### This component is still in development and has a little more work to be done before it is production ready. Feel free to play around with it. Should be ready soon.

## Features

- [x] Requires react-native .43 or higher.

- [x] Uses the [Giphy Api](https://github.com/Giphy/GiphyAPI) for search.

- [x] Infinitely scrolling lists of Giphy's.

- [x] Searches as you type.

- [x] Easy integration with [react native gifted chat](gifted.chat).

- [x] Uses react natives new flatlist component under the hood for awesome performance and non-buggy rendering. Also, returns small amounts of data at a time for fast GIF loading and performant scrolling even over slow connections.

- [x] Uses react-native-image-progress for nice, progress indicators while images are returned.

## Demo and Example

Run example app by cloning this repo

    git clone https://github.com/joinspontaneous/react-native-giphy
    yarn install
    react-native run-ios

## Installation
Requires React-Native 42 or higher.

    yarn add react-native-giphy

then import the componenent in your app

    import GifSearch from 'react-native-giphy';

## Props

| Prop | Type | Description | Default |
|------|------|-------------|---------|
|inputText|String |current text state of whatever input you are using | Trending Gifs|
|handleGifSelect|Func|function that takes the url of the selected Gif as a param| () => |
|ApiKey|String|Your API key|GiphyPublic API key|






react-native-giphy has two required props.

react-native-giphy was meant to be used with a controlled input and takes the state of your input as a prop called "inputText." React-native-giphy also requires a function to handle a gif press. The press will return the url of the desired gif.

Future updates will allow you specify the size and quality of the returned gif. For now, the component only passes the url of a low quality 200x200 px downsampled gif for which is a good mix of quality and size and perfomance in mobile chat applications but can be low on the quality side for some GIFs. Expect to see this added as a customizable prop soon.

```javascript
 <Giphy
  inputText={ this.state.text }
  handleGifSelect={ (url) => url }
  />
  <TextInput
    onChangeText={ (text) => { this.setState({ text }) } }
    value={ this.state.text }
  />
```

As shown in the example App, it's best to avoid the keyboard. The component will render a fixed 100x100 row of square images. If no text is on the input, the return gifs will be only 25 trending GIF images from Giphy. Any search will render a list that scrolls infinitely (5000 GIFs I believe is the limit of the API). I doubt any user will scroll through all 5000.

## TODO
[] add props for styling
[] add props for user production api key
[]
