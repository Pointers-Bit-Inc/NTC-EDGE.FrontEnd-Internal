  import * as React from 'react';
import {Text, View, StyleSheet, ScrollView, TextInput, Platform, useWindowDimensions} from 'react-native';


import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart,
} from 'react-native-chart-kit';
  import LeftSideWeb from "@atoms/left-side-web";
  import Header from "@molecules/header";
  import SearchIcon from "@assets/svg/search";
  import {isMobile} from "@pages/activities/isMobile";
  import {isTablet} from "@/src/utils/formatting";
  import {useState} from "react";
  import {styles} from "@pages/activities/styles";
  const  Dashboard = () => {
      const dimensions=useWindowDimensions();
      const [value,setValue]=useState();
      const [text, onChangeText] = React.useState("");
      const [txt, setText] = React.useState("");
        return (
            <View style={{backgroundColor: "#F8F8F8", flex: 1, flexDirection: "row"}}>
                <LeftSideWeb>
                    <View style={styles.header}>
                        <Header title={"Dashboard"}/>
                        <View style={{marginHorizontal:26,}}>

                            <View style={{
                                paddingTop:14,
                                paddingBottom:12,
                                alignItems:"center",
                                justifyContent:"space-between",
                                flexDirection:"row",
                                flex:1
                            }}>
                                <View style={{flex:1,paddingRight:15}}>
                                    <TextInput value={value} onChangeText={text=>{
                                        setValue(text)
                                    }} placeholderTextColor={"#6E7191"} placeholder={"Search"} style={styles.search}/>
                                    <View style={styles.searchIcon}>
                                        <SearchIcon/>
                                    </View>
                                </View>

                            </View>
                        </View>
                    </View>
                </LeftSideWeb>
                {
                    !(
                        (
                            isMobile && !(
                                Platform?.isPad || isTablet()))) && dimensions?.width > 768 &&
                    <View style={[{flex: 1, justifyContent: "center", alignItems: "center"}]}>

                        <ScrollView showsVerticalScrollIndicator={true}>

                                <View>



                                    {/*Example of Bezier LineChart*/}
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                fontSize: 18,
                                                padding: 16,
                                                marginTop: 16,
                                            }}>
                                            Bezier Line Chart
                                        </Text>
                                        <LineChart
                                            data={{
                                                labels: ['January', 'February', 'March', 'April'],
                                                datasets: [
                                                    {
                                                        data: [
                                                            Math.random() * 100,
                                                            Math.random() * 100,
                                                            Math.random() * 100,
                                                            Math.random() * 100,
                                                            Math.random() * 100,
                                                            Math.random() * 100,
                                                        ],
                                                    },
                                                ],
                                            }}
                                            width={dimensions.width * 0.55} // from react-native
                                            height={220}
                                            yAxisLabel={'$'}
                                            chartConfig={{
                                                backgroundColor: '#1cc910',
                                                backgroundGradientFrom: '#eff3ff',
                                                backgroundGradientTo: '#efefef',
                                                decimalPlaces: 2, // optional, defaults to 2dp
                                                color: (opacity = 255) => `rgba(0, 0, 0, ${opacity})`,
                                                style: {
                                                    borderRadius: 16,
                                                },
                                                propsForDots: {
                                                    r: '6',
                                                    strokeWidth: '2',
                                                    stroke: '#ffa726',
                                                },
                                                propsForBackgroundLines: {
                                                    strokeDasharray: '', // solid background lines with no dashes
                                                },
                                            }}
                                            bezier
                                            style={{
                                                marginVertical: 8,
                                                borderRadius: 16,
                                            }}
                                        />



                                    {/*Example of LineChart*/}
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            fontSize: 18,
                                            padding: 16,
                                            marginTop: 16,
                                        }}>
                                        Line Chart
                                    </Text>
                                    <LineChart
                                        data={{
                                            labels: [
                                                'January',
                                                'February',
                                                'March',
                                                'April',
                                                'May',
                                                'June',
                                            ],
                                            datasets: [
                                                {
                                                    data: [20, 45, 28, 80, 99, 43],
                                                    strokeWidth: 2,
                                                },
                                            ],
                                        }}
                                        width={dimensions.width * 0.55}
                                        height={220}
                                        chartConfig={{
                                            backgroundColor: '#1cc910',
                                            backgroundGradientFrom: '#eff3ff',
                                            backgroundGradientTo: '#efefef',
                                            decimalPlaces: 2,
                                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                            style: {
                                                borderRadius: 16,
                                            },
                                        }}
                                        style={{
                                            marginVertical: 8,
                                            borderRadius: 16,
                                        }}
                                    />




                                    {/*Example of Progress Chart*/}
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            fontSize: 18,
                                            padding: 16,
                                            marginTop: 16,
                                        }}>
                                        Progress Chart
                                    </Text>
                                    <ProgressChart
                                        data={

                                            [0.4, 0.6, 0.8]
                                        }
                                        width={dimensions.width * 0.55}
                                        height={220}
                                        chartConfig={{
                                            backgroundColor: '#1cc910',
                                            backgroundGradientFrom: '#eff3ff',
                                            backgroundGradientTo: '#efefef',
                                            decimalPlaces: 2,
                                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                            style: {
                                                borderRadius: 16,
                                            },
                                        }}
                                        style={{
                                            marginVertical: 8,
                                            borderRadius: 16,
                                        }}
                                    />




                                    {/*Example of Bar Chart*/}
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            fontSize: 18,
                                            padding: 16,
                                            marginTop: 16,
                                        }}>
                                        Bar Chart
                                    </Text>
                                    <BarChart
                                        data={{
                                            labels: [
                                                'January',
                                                'February',
                                                'March',
                                                'April',
                                                'May',
                                                'June',
                                            ],
                                            datasets: [
                                                {
                                                    data: [20, 45, 28, 80, 99, 43],
                                                },
                                            ],
                                        }}
                                        width={dimensions.width * 0.55}
                                        height={220}
                                        yAxisLabel={'$'}
                                        chartConfig={{
                                            backgroundColor: '#1cc910',
                                            backgroundGradientFrom: '#eff3ff',
                                            backgroundGradientTo: '#efefef',
                                            decimalPlaces: 2,
                                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                            style: {
                                                borderRadius: 16,
                                            },
                                        }}
                                        style={{
                                            marginVertical: 8,
                                            borderRadius: 16,
                                        }}
                                    />




                                    {/*Example of StackedBar Chart*/}
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            fontSize: 18,
                                            padding: 16,
                                            marginTop: 16,
                                        }}>
                                        Stacked Bar Chart
                                    </Text>
                                    <StackedBarChart
                                        data={{
                                            labels: ['Test1', 'Test2'],
                                            legend: ['L1', 'L2', 'L3'],
                                            data: [[60, 60, 60], [30, 30, 60]],
                                            barColors: ['#dfe4ea', '#ced6e0', '#a4b0be'],
                                        }}
                                        width={dimensions.width * 0.55}
                                        height={220}
                                        chartConfig={{
                                            backgroundColor: '#1cc910',
                                            backgroundGradientFrom: '#eff3ff',
                                            backgroundGradientTo: '#efefef',
                                            decimalPlaces: 2,
                                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                            style: {
                                                borderRadius: 16,
                                            },
                                        }}
                                        style={{
                                            marginVertical: 8,
                                            borderRadius: 16,
                                        }}
                                    />



                                    {/*Example of Pie Chart*/}
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            fontSize: 18,
                                            padding: 16,
                                            marginTop: 16,
                                        }}>
                                        Pie Chart
                                    </Text>
                                    {/*<PieChart
                                        data={[
                                            {
                                                name: 'Seoul',
                                                population: 21500000,
                                                color: 'rgba(131, 167, 234, 1)',
                                                legendFontColor: '#7F7F7F',
                                                legendFontSize: 15,
                                            },
                                            {
                                                name: 'Toronto',
                                                population: 2800000,
                                                color: '#F00',
                                                legendFontColor: '#7F7F7F',
                                                legendFontSize: 15,
                                            },
                                            {
                                                name: 'New York',
                                                population: 8538000,
                                                color: '#ffffff',
                                                legendFontColor: '#7F7F7F',
                                                legendFontSize: 15,
                                            },
                                            {
                                                name: 'Moscow',
                                                population: 11920000,
                                                color: 'rgb(0, 0, 255)',
                                                legendFontColor: '#7F7F7F',
                                                legendFontSize: 15,
                                            },
                                        ]}
                                        width={dimensions.width * 0.55}
                                        height={220}
                                        chartConfig={{
                                            backgroundColor: '#1cc910',
                                            backgroundGradientFrom: '#eff3ff',
                                            backgroundGradientTo: '#efefef',
                                            decimalPlaces: 2,
                                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                            style: {
                                                borderRadius: 16,
                                            },
                                        }}
                                        style={{
                                            marginVertical: 8,
                                            borderRadius: 16,
                                        }}
                                        accessor="population"
                                        backgroundColor="transparent"
                                        paddingLeft="15"
                                        absolute //for the absolute number remove if you want percentage
                                    />
*/}


                                    {/*Example of Contribution Chart*/}
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            fontSize: 18,
                                            padding: 16,
                                            marginTop: 16,
                                        }}>
                                        Contribution Graph
                                    </Text>
                                    <ContributionGraph
                                        values={[
                                            { date: '2019-01-02', count: 1 },
                                            { date: '2019-01-03', count: 2 },
                                            { date: '2019-01-04', count: 3 },
                                            { date: '2019-01-05', count: 4 },
                                            { date: '2019-01-06', count: 5 },
                                            { date: '2019-01-30', count: 2 },
                                            { date: '2019-01-31', count: 3 },
                                            { date: '2019-03-01', count: 2 },
                                            { date: '2019-04-02', count: 4 },
                                            { date: '2019-03-05', count: 2 },
                                            { date: '2019-02-30', count: 4 },
                                        ]}
                                        endDate={new Date('2019-04-01')}
                                        numDays={105}
                                        width={dimensions.width * 0.55}
                                        height={220}
                                        chartConfig={{
                                            backgroundColor: '#1cc910',
                                            backgroundGradientFrom: '#eff3ff',
                                            backgroundGradientTo: '#efefef',
                                            decimalPlaces: 2,
                                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                            style: {
                                                borderRadius: 16,
                                            },
                                        }}
                                    />
                                </View>
                        </ScrollView>


                    </View>
                }

            </View>
        )
  }
  export default Dashboard
  const style = StyleSheet.create({
      container: {
          flex: 1,
          justifyContent: 'center',
          padding: 8,
          paddingTop: 30,
          backgroundColor: '#ecf0f1',
      },

  });

