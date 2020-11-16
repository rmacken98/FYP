import React from './node_modules/react';
import { GooglePlacesAutocomplete } from './node_modules/react-native-google-places-autocomplete';

class SearchBar extends React.Component {

    render() {
        return (

            <GooglePlacesAutocomplete
                placeholder='Search'
                minLength={2} // minimum length of text to search
                //autoFocus={false}
               // returnKeyType={'search'} // Can be left out for default return key 
                listViewDisplayed={false}    // true/false/undefined
                fetchDetails={true}
                onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                    this.props.notifyChange(details.geometry.location);
                }
                }

                query={{
                    key: 'AIzaSyCOVmY_-JN6AY1x5a80rXwTHgLXWtUdf5E',
                    language: 'en'
                }}

                nearbyPlacesAPI='GooglePlacesSearch'
                debounce={300}
            />
        );
    }
}
export default SearchBar;