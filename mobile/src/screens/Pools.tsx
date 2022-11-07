import { VStack, Icon, useToast,FlatList } from 'native-base'
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native'
import { api } from '../services/api';
import { PoolCard, PoolCardProps } from '../components/PoolCard';
import { Loading } from '../components/Loading';
import { EmptyPoolList } from '../components/EmptyPoolList';

export function Pools() {
  const [isLoading, setIsLoading] = useState(true);
  const [pools, setPools] = useState<PoolCardProps[]>([]);

  const toast = useToast();

  async function fetchPools() {
    try {
      setIsLoading(true);
      const response = await api.get('/pools');
      //console.log('Pools', response.data.pools);
      setPools(response.data.pools);
    } catch (err) {
      console.log(err);

      return toast.show({
        title: 'Não foi possível carregar os bolões',
        placement: 'top',
        bgColor: 'red.500'
    });
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(useCallback(() => {
    fetchPools();
  }, []));

  const { navigate }  = useNavigation();
  return (
    <VStack flex={1} bgColor='gray.900'>
        <Header title='Meus bolões'/>
        <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor='gray.600' pb={4} mb={4}>
            <Button
                title='BUSCAR BOLÃO POR CÓDIGO'
                leftIcon={<Icon as={Octicons} name='search' color='black' size='md'/>}
                onPress={() => navigate('find')}
                isLoading={isLoading}
            />
        </VStack>
        {
            isLoading ? <Loading /> :
            <FlatList
              contentContainerStyle={{
                flexGrow: 1,
              }}
              data={pools}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <PoolCard
                  data={item}
                  onPress={() => navigate('details', {id: item.id})}
                />)}
              px={5}
              showsVerticalScrollIndicator={false}
              _contentContainerStyle={{ pb : 10 }}
              ListEmptyComponent={() => <EmptyPoolList />}
            />
        }
    </VStack>
  )
}