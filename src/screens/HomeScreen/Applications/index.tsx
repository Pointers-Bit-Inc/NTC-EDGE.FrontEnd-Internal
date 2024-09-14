import React, { FC } from 'react'
import { Feather, MaterialIcons } from '@expo/vector-icons'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import styles from './styles'

interface Props {
    navigation: any
    route: any,
    params: any
}
const Applications: FC<Props> = ({ navigation }) => {
    React.useEffect(() => {
        navigation.setOptions({
            tabBarLabel: ({ color }: any) =>
                <View style={styles.drawerItem}>
                    <Feather name="refresh-ccw" size={24} color={color} style={{ marginEnd: 10 }} />
                    <Text style={{ fontWeight: "bold", color }}>Applications</Text>
                </View>
        })
    }, [])
    return (
        <ScrollView
            style={[styles.container]}
            showsVerticalScrollIndicator={false}
        >
            {
                Array(10).fill(0).map((_, i) =>
                    <View
                        key={i}
                        style={styles.applicationContainer}
                    >
                        <TouchableOpacity>
                            <View style={styles.applicationTitle}>
                                <Text style={{ fontWeight: 'bold' }}>Application {i + 1}</Text>
                                <MaterialIcons name="add" size={24} color="black" style={{ marginEnd: 5 }} />
                            </View>
                        </TouchableOpacity>
                    </View>
                )
            }
        </ScrollView>
    )
}
export default Applications
