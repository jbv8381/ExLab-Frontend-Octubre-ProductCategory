/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from 'react'
import { StyleSheet, FlatList, Pressable, View } from 'react-native'
import { getCategories} from '../../api/CategoriesEndpoints'
import { showMessage } from 'react-native-flash-message'
import * as GlobalStyles from '../../styles/GlobalStyles'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import TextRegular from '../../components/TextRegular'
import TextSemiBold from '../../components/TextSemibold'
import { remove } from '../../api/CategoriesEndpoints'
import DeleteModal from '../../components/DeleteModal'

export default function RestaurantDetailScreen({ navigation, route }) {
  const [productCategory, setProductCategory] = useState({})
  const [productCategoryToBeDeleted, setProductCategoryToBeDeleted] = useState(null)


  useEffect(() => {
      fetchProductCategories()
    }, [route])


  const fetchProductCategories = async () => {
    try {
      const fetchedCategories = await getCategories(route.params.id)
      setProductCategory(fetchedCategories)
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving product categories. ${error}`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const renderHeader = () => {
    return (
      <View>
        <Pressable
          onPress={() => navigation.navigate('CreateProductCategoryScreen', { id: route.params.id })
          }
          style={({ pressed }) => [
            {
              backgroundColor: pressed
                ? GlobalStyles.brandGreenTap
                : GlobalStyles.brandGreen
            },
            styles.button
          ]}>
          <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
            <MaterialCommunityIcons name='plus-circle' color={'white'} size={20} />
            <TextRegular textStyle={styles.text}>
              Create product category
            </TextRegular>
          </View>
        </Pressable>
      </View>
    )
  }
  
  const renderProductCategory = ({ item }) => {
    return (
      <View style={styles.categoryRow}>
        <TextSemiBold textStyle={styles.categoryName}>{item.name}</TextSemiBold>
        <View style={styles.actionButtonsContainer}>
          <Pressable
            onPress={() => { setProductCategoryToBeDeleted(item) }}
            style={({ pressed }) => [
              {
                backgroundColor: pressed
                  ? GlobalStyles.brandPrimaryTap
                  : GlobalStyles.brandPrimary
              },
              styles.actionButton
            ]}>
            <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
              <MaterialCommunityIcons name='delete' color={'white'} size={20} />
              <TextRegular textStyle={styles.text}>
                Delete
              </TextRegular>
            </View>
          </Pressable>
        </View>
      </View>
    )
  }

  const removeProductCategory = async (item) => {
    try {
      await remove(route.params.id, item.id)
      await fetchProductCategories()
      setProductCategoryToBeDeleted(null)
      showMessage({
        message: `Product Category succesfully removed`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    } catch (error) {
      console.log(error)
      setProductCategoryToBeDeleted(null)
      showMessage({
        message: `Product Category could not be removed.`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const renderEmptyProductCategoriesList = () => {
      return (
        <TextRegular textStyle={styles.emptyList}>
          This restaurant has no product categories yet.
        </TextRegular>
      )
    }

  return (
    <View style={styles.container}>
          <FlatList
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={renderEmptyProductCategoriesList}
            style={styles.container}
            data={productCategory}
            renderItem={renderProductCategory}
            keyExtractor={item => item.id.toString()}
          />
          <DeleteModal
            isVisible={productCategoryToBeDeleted !== null}
            onCancel={() => setProductCategoryToBeDeleted(null)}
            onConfirm={() => removeProductCategory(productCategoryToBeDeleted)}>
          </DeleteModal>
        </View>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1, alignContent: 'center', padding: 10
  },
  categoryName: {
    textAlign: 'center',
    flex: 1,
  },
  categoryRow: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 5,
    paddingHorizontal: 10,

    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
    flex: 1
  },
  button: {
    borderRadius: 8,
    height: 40,
    marginTop: 12,
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    width: '80%'
  },
  actionButton: {
    borderRadius: 8,
    height: 40,
    flex: 1,
    marginTop: 12,
    margin: '1%',
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'column',
    width: '50%'
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    bottom: 5,
    flex: 1,
  },
  text: {
    fontSize: 16,
    color: 'white',
    alignSelf: 'center',
    marginLeft: 5
  },
  emptyList: {
    textAlign: 'center',
    padding: 50
  }
})