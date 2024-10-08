import { Store } from '@fleetbase/storefront';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useMountedState, useFilesystem } from 'hooks';
import useStorefront, { adapter as StorefrontAdapter } from 'hooks/use-storefront';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Carousel from 'react-native-snap-carousel';
import tailwind from 'tailwind';
import { translate } from 'utils';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const carouselItemWidth = 265;
const carouselItemHeight = 170;

const StorePhotosScreen = ({ navigation, route }) => {
    const { info, storeData, initialMedia } = route.params;

    const storefront = useStorefront();
    const isMounted = useMountedState();
    const insets = useSafeAreaInsets();
    const carouselRef = useRef();
    const {getUrl} = useFilesystem()

    const store = new Store(storeData, StorefrontAdapter);

    const [isLoading, setIsLoading] = useState(false);
    const [viewingPhoto, setViewingPhoto] = useState(initialMedia);

    const isModalVisible = viewingPhoto !== null && viewingPhoto !== undefined;
    const medias = store?.getAttribute('media', []) ?? [];
    const currentIndex = medias?.indexOf(viewingPhoto);

    return (
        <View style={[tailwind('bg-black')]}>
            <View style={tailwind('h-full w-full')}>
                <View style={tailwind('flex flex-row items-center p-4 z-10')}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={tailwind('mr-4')}>
                        <View style={tailwind('rounded-full bg-gray-100 w-10 h-10 flex items-center justify-center')}>
                            <FontAwesomeIcon icon={faTimes} />
                        </View>
                    </TouchableOpacity>
                    <View style={tailwind('flex flex-col items-start')}>
                        <Text style={tailwind('text-xl font-bold text-white')}>{store.getAttribute('name')}</Text>
                        <Text style={tailwind('text-sm font-semibold text-white')}>
                            {translate('Shared.StorePhotosScreen.title', { storeMediaCount: store.getAttribute('media', [])?.length || 0 })}
                        </Text>
                    </View>
                </View>
                <ScrollView style={tailwind('w-full h-full pb-12')}>
                    <View style={tailwind('flex flex-row flex-wrap')}>
                        {medias?.map((media, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => setViewingPhoto(media)}
                                style={[tailwind('w-1/3 h-36 border-4 border-gray-900'), currentIndex === index ? tailwind('border-green-500') : null]}>
                                <FastImage source={{ uri: getUrl(media.url) }} style={tailwind('w-full h-full')} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </View>
            <Modal visible={isModalVisible} animationType={'slide'} transparent={true}>
                <View style={[tailwind('bg-black bg-opacity-75 mt-1'), { paddingTop: Math.max(insets.top, 24) }]}>
                    <View style={tailwind('flex flex-row items-center p-4 z-10')}>
                        <TouchableOpacity onPress={() => setViewingPhoto(null)} style={tailwind('mr-4')}>
                            <View style={tailwind('rounded-full bg-gray-100 w-10 h-10 flex items-center justify-center')}>
                                <FontAwesomeIcon icon={faTimes} />
                            </View>
                        </TouchableOpacity>
                        <Text style={tailwind('text-xl font-bold text-white')}>{viewingPhoto?.caption ?? translate('Shared.StorePhotosScreen.viewingPhoto')}</Text>
                    </View>
                    <View style={tailwind('h-full w-full')}>
                        <View style={{ marginTop: width / 2.5 }}>
                            <Carousel
                                ref={carouselRef}
                                layout={'default'}
                                data={medias}
                                renderItem={({ item }) => <FastImage source={{ uri: getUrl(item?.url) }} style={{ width: '100%', aspectRatio: 135 / 76 }} />}
                                sliderWidth={width}
                                sliderHeight={height}
                                itemWidth={width}
                                itemHeight={height}
                                onSnapToItem={(slideIndex) => setViewingPhoto(medias[slideIndex])}
                                firstItem={currentIndex}
                                enableMomentum={true}
                            />
                            {/* <Pagination
                                dotsLength={medias.length}
                                activeDotIndex={currentIndex}
                                containerStyle={tailwind('py-4 mt-12')}
                                dotStyle={tailwind('rounded-full w-3 h-3 mx-2 bg-gray-600 border border-gray-600')}
                                inactiveDotStyle={tailwind('rounded-full w-3 h-3 mx-2 bg-gray-100 border border-gray-900')}
                                inactiveDotOpacity={0.4}
                                inactiveDotScale={0.6}
                            /> */}
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default StorePhotosScreen;
