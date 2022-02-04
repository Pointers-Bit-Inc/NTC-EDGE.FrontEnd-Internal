import React from 'react'
import { View, StyleSheet, Animated, Easing } from 'react-native'

const SIZE = 10
const MARGIN = 7.5
const BG = '#407BFF'
const ACTIVE_BG = '#D0E1FF'
const dots = [1, 2, 3, 4]
const INTERVAL = 50
const ANIMATION_DURATION = 300
const ANIMATION_SCALE = 1
export default class ThreeDotsLoader extends React.Component {
    state = {
        active: 1
    }

    componentDidMount(){
        this.interval = setInterval(() => {
            const active = this.state.active
            this.setState({ active: active > 3 ? 1 : active + 1})
        }, INTERVAL);
    }

    componentWillUnmount(){
        clearInterval(this.interval)
    }

    render() {
        const active = this.state.active
        return (
            <View style={styles.main}>
                {dots.map((i, index) => <Dot key={index} {...this.props} active={i === active}/>)}
            </View>
        )
    }
}

class Dot extends React.Component {
    static defaultProps = {
        size: SIZE,
        background: BG,
        activeBackground: ACTIVE_BG,
        dotMargin: MARGIN,
        animationDuration: ANIMATION_DURATION,
        animationScale: ANIMATION_SCALE,
    }

    constructor(props) {
        super(props)
        this.scale = new Animated.Value(1)
    }

    componentDidMount(){
        if (this.props.active) this.scaleUp()
    }

    componentDidUpdate(prevProps){
        if (prevProps.active && !this.props.active){
            this.scaleDown()
        }
        if (!prevProps.active && this.props.active){
            this.scaleUp()
        }
    }

    scaleDown = () => {
        Animated.timing(
            this.scale,
            {
                useNativeDriver: false,
                toValue: 1,
                duration: this.props.animationDuration,
            }
        ).start()
    }

    scaleUp = () => {
        Animated.timing(
            this.scale,
            {
                useNativeDriver: false,
                toValue: this.props.animationScale,
                duration: this.props.animationDuration
            }
        ).start()
    }

    render(){
        const { active, size, background, activeBackground, dotMargin } = this.props
        const style = {
            height: size,
            width: size,
            borderRadius: size / 2,
            marginHorizontal: dotMargin,
            backgroundColor: active ? activeBackground : background
        }
        return (
            <Animated.View style={[style, {transform: [{ scale: this.scale }]}]}/>
        )
    }
}

const styles = StyleSheet.create({
    main: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
})