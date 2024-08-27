import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import React, { FC } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from './styles'
import Button from "@atoms/button";

interface Props {
    navigation: any
}

const HomeScreen: FC<Props> = ({navigation}) => {
    React.useEffect(() => {
        navigation.setOptions({
            // drawerIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />
        })
    }, [])
    return (
        <SafeAreaView style={styles.container} >
            <View style={styles.header}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Image
                        style={{ width: 50, height: 50, marginEnd: 10, borderRadius: 50 }}
                        source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/National_Telecommunications_Commission.svg/1024px-National_Telecommunications_Commission.svg.png' }}
                    />
                    <View>
                        <Text style={{ fontSize: 9 }}>Republic of the Phillipines</Text>
                        <Text style={{ fontSize: 9, fontWeight: "bold", textTransform: "uppercase" }}>National Telecommunications Commission</Text>
                    </View>
                </View>
                <View>
                    <TouchableOpacity onPress={() => navigation.navigate('Settings')/*openDrawer()*/}>
                        <MaterialCommunityIcons name="menu" size={24} color="black" />
                    </TouchableOpacity>
                </View>

            </View>
            <Button onPress={()=>{
                navigation.push("ActivitiesScreen")
            }}>
                <Text>{'Qrcode'}</Text>
            </Button>
        </SafeAreaView>
    )
}

export default HomeScreen

