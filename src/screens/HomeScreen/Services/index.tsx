import { Feather, FontAwesome, Ionicons, SimpleLineIcons } from '@expo/vector-icons'
import React, { FC } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Collapsible from 'react-native-collapsible'
import { primaryColor } from '@/src/styles/color'
import styles from './styles'

interface Props {
    navigation: any
    route: any,
    params: any,
}
const Services: FC<Props> = ({ navigation }) => {
    React.useEffect(() => {
        navigation.setOptions({
            tabBarLabel: ({ color }: any) =>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <FontAwesome name="pencil-square-o" color={color} size={24} style={{ marginEnd: 10 }} />
                    <Text style={{ fontWeight: "bold", color }}>Services</Text>
                </View>
        })
    }, [])

    const onSelectService = () => navigation.navigate('ApplicationSteps');

    return (
        <ScrollView
            style={[styles.container]}
            showsVerticalScrollIndicator={false}
        >
            {
                Array(10).fill(0).map((_, i) => <Service onSelectService={onSelectService} key={i} index={i} />)
            }
        </ScrollView>
    )
}
const Service = ({ index, onSelectService }: any) => {
    const [collapsed, setCollapsed] = React.useState(true)
    return (
        <View style={styles.serviceContainer}>
            <View style={styles.serviceTitle}>
                <Text style={{ fontWeight: 'bold' }}>Services {index + 1}</Text>
                <TouchableOpacity onPress={() => setCollapsed(collapsed => !collapsed)}>
                    {!collapsed ? <Ionicons name="close" size={24} color="black" /> : <Feather name="plus" size={24} color="black" />}
                </TouchableOpacity>

            </View>
            <SubService onSelectService={onSelectService} isCollapsed={collapsed} />
        </View>
    )
}
const SubService = ({ isCollapsed, onSelectService }: any) => {
    return (
        <Collapsible collapsed={isCollapsed}>
            {
                Array(3).fill(0).map((_, i) =>
                    <TouchableOpacity key={i} onPress={onSelectService}>
                        <View style={styles.subServiceTitle}>
                            <Text style={{ color: primaryColor }}>Sub-service {i + 1}</Text>
                            <SimpleLineIcons name="arrow-right" size={15} color={primaryColor} style={{ marginEnd: 5 }} />
                        </View>
                    </TouchableOpacity>
                )
            }

        </Collapsible>
    )
}
export default Services
