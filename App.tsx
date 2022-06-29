/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  ImageBackground,
  View,
  Dimensions,
  Button,
  FlatList,
  TouchableWithoutFeedback,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SketchCanvas, SketchCanvasRef } from 'rn-perfect-sketch-canvas';
import api from './api';

const App = () => {
  const canvasRef = React.useRef<SketchCanvasRef>(null);
  const image = { uri: "http://10.10.10.184:9090/static/mobile/sample/output.png" };
  const { width, height } = Dimensions.get("window");

  const words = [
    'し',
    'ま',
    'ん',
    'ろ',
    'よ',
    'こ',
    'へ',
    'は',
    'た',
    'も',
    'け'
  ]
  const [wordId, setWordId] = React.useState(0);
  const [result, setResult] = React.useState('');
  const [inputText, setInputext] = React.useState('');

  const CustomPicker = ({ label, data, currentIndex, onSelected }) => {
    return (
      <>
        <Text style={styles.title}>{label}</Text>
        <View style={styles.wrapperHorizontal}>
          <FlatList
            bounces
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            horizontal
            data={data}
            keyExtractor={(item, idx) => String(item)}
            renderItem={({ item, index }) => {
              const selected = index === currentIndex;
              return (
                <TouchableWithoutFeedback onPress={() => onSelected(index)}>
                  <View
                    style={[
                      styles.itemStyleHorizontal,
                      selected && styles.itemSelectedStyleHorizontal
                    ]}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        color: selected ? "black" : "grey",
                        fontWeight: selected ? "bold" : "normal"
                      }}
                    >
                      {item + ""}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              );
            }}
          />
        </View>
      </>
    );
  }

  const onChange = async (text: number) => {
    const data = await api.getSample(words[text])
    canvasRef.current?.reset()
    setWordId(text)
    setResult('')
  };

  const onChangeWord = async () => {
    const data = await api.getSample(inputText)
    canvasRef.current?.reset()
    setWordId(0)
    setResult('')
  };

  const onCheck = async () => {
    const res = await api.compareStroke(JSON.stringify(canvasRef.current?.toPoints()), width)
    setResult(res.mess)
  };
  return (
    <SafeAreaView>
      <ImageBackground
        key={(new Date()).getTime()}
        source={{ uri: "http://10.10.10.184:9090/static/mobile/sample/output.png" + '?time' + (new Date()).getTime(), headers: { Pragma: 'no-cache' } }}
        resizeMode="cover"
        style={{ width: width, height: width }}>
        <SketchCanvas
          ref={canvasRef}
          strokeColor={'black'}
          strokeWidth={15}
          containerStyle={{ width: width, height: width }}
        />
      </ImageBackground>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} >

        <Button
          onPress={() => canvasRef.current?.reset()}
          title="Reset"
          color="blue"
        />
        <Button
          onPress={() => {
            onCheck()
          }}
          title="Check"
          color="blue"
        />
        <CustomPicker
          label="Select Word"
          data={words}
          currentIndex={wordId}
          onSelected={(val) => {
            onChange(val)
          }}
        />
        <TextInput
          // style={[
          // ]}
          // defaultValue={textValue}
          maxLength={1}
          numberOfLines={1}
          placeholder={"Enter word"}
          autoCapitalize="none"
          keyboardType='default'
          onChangeText={(text) => {
            setInputext(text)
          }}
        />
        <Button
          onPress={() => {
            onChangeWord()
          }}
          disabled={inputText == ''}
          title="Change"
          color="blue"
        />
        <Text>{result}</Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "#ecf0f1",
    padding: 8
  },
  paragraph: {
    paddingVertical: 0,
    textDecorationColor: "yellow",
    margin: 24
  },
  wrapperHorizontal: {
    height: 54,
    justifyContent: "center",
    color: "black",
    marginBottom: 12
  },
  itemStyleHorizontal: {
    marginRight: 10,
    height: 50,
    padding: 8,
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 25,
    textAlign: "center",
    justifyContent: "center"
  },
  itemSelectedStyleHorizontal: {
    borderWidth: 2,
    borderColor: "#DAA520"
  },
  platformContainer: {
    marginTop: 8,
    borderTopWidth: 1
  },
  platformContainerTitle: {
    marginTop: 8
  },
  title: {
    fontWeight: "bold",
    marginVertical: 4
  }
});

export default App;
