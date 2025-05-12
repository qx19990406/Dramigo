import {useEffect, useRef, useState} from 'react';
import Slider from '@react-native-community/slider';
import {Image, StyleSheet, View} from 'react-native';
import Video from 'react-native-video';
import {SingleTouchable} from './SingleTouchable';
import {clearCache, convertAsync} from 'react-native-video-cache-control';
import lodash from 'lodash';
import {useNavigation} from '@react-navigation/native';

export default function CustomVideoPlayer({
                                              videoUrl = '',
                                              isPlay = false,
                                              width,
                                              height,
                                              isClear = false,
                                          }) {
    const navigation = useNavigation();

    const videoRef = useRef(null);
    const [paused, setPaused] = useState(true);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [proxyUrl, setProxyUrl] = useState('');
    const [mouseSlider, setMouseSlider] = useState(false);

    useEffect(() => {
        return navigation.addListener('blur', () => {
            setPaused(true);
        });
    }, [navigation]);

    useEffect(() => {
        setPaused(!isPlay);
    }, [isPlay]);

    useEffect(() => {
        if (!isClear && !proxyUrl && videoUrl) {
          convertAsync({url: videoUrl}).then((res) => {
            setProxyUrl(res);
          });
        } else if (isClear && videoRef.current) {
            videoRef.current.seek(0);
            videoRef.current.pause();
            setPaused(true);
            if (proxyUrl) {
              clearCache(videoUrl).then();
              setProxyUrl('');
            }
        }
    }, [isClear, videoUrl]);

    const handlePlayPause = () => {
        setPaused(!paused);
    };

    const handleSeek = value => {
        setMouseSlider(false);
        if (videoRef.current) {
            videoRef.current.seek(value);
            setPaused(false);
            setCurrentTime(value);
        }
    };

    const handleVideoLoad = meta => {
        setDuration(meta.duration);
    };

    const handleEnd = () => {
        if (videoRef.current) {
            videoRef.current.seek(0);
        }
    };

    const handleVideoProgress = lodash.throttle((data) => {
        setCurrentTime(data?.currentTime);
    }, 1000);

    return (
        <SingleTouchable onPress={handlePlayPause} style={styles.container}>
            <Video
                ref={videoRef}
                source={{
                    uri: proxyUrl,
                    bufferConfig: {
                        minBufferMs: 15000, // 最小缓冲时间：15秒
                        maxBufferMs: 50000, // 最大缓冲时间：50秒
                        bufferForPlaybackMs: 2000, // 播放前需要缓冲的时间：2秒
                        bufferForPlaybackAfterRebufferMs: 5000, // 重新缓冲后需要缓冲的时间：5秒
                    },
                }}
                style={{width: width, height: height}}
                paused={paused}
                resizeMode="cover"
                controls={false}
                onLoad={handleVideoLoad}
                onProgress={handleVideoProgress}
                onEnd={handleEnd}
                preload="auto"
            />
            {!paused ? null : (
                <Image
                    style={styles.playBtn}
                    source={require('../assets/video/play.png')}
                />
            )}
            <View style={mouseSlider ? styles.progressContainerMouse : styles.progressContainer}>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={duration}
                    value={currentTime}
                    onSlidingStart={() => {
                        setPaused(true);
                        setMouseSlider(true);
                    }}
                    onSlidingComplete={handleSeek}
                    minimumTrackTintColor="#E21220"
                    maximumTrackTintColor="#FFFFFF"
                    thumbTintColor="#fff"
                />
                {/*<Text style={styles.timeText}>{`${Math.floor(currentTime / 60)}:${Math.floor(currentTime % 60).toString().padStart(2, '0')}`}</Text>*/}
                {/*<Text style={styles.timeText}>{`${Math.floor(duration / 60)}:${Math.floor(duration % 60).toString().padStart(2, '0')}`}</Text>*/}
            </View>
        </SingleTouchable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#100000',
        position: 'relative',
        zIndex: 0,
    },
    playBtn: {
        position: 'absolute',
        width: 32,
        height: 37,
        top: '50%',
        left: '60%',
        transform: [{translateX: -50}, {translateY: -50}],
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        bottom: -19,
        zIndex: 33333,
    },
    // 进度条被操作时的样式
    progressContainerMouse: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        bottom: -10,
        zIndex: 33333,
    },
    slider: {
        flex: 1,
        height: 40,
    },
    timeText: {
        color: '#fff',
        marginHorizontal: 10,
    },
});
