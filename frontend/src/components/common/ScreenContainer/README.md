# ScreenContainer Component

A reusable screen container component that provides consistent layout and styling for all screens in the DishDive app, including a navigation bar and safe area handling.

## Features

- Consistent styling across all screens
- Built-in navigation bar with customizable title and buttons
- Safe area handling for different device types using SafeAreaView
- Loading state support with custom loading component
- Flexible content container with customizable styling

## Usage

```tsx
import { ScreenContainer } from '../../components/common';

const MyScreen = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data
    fetchData().then((result) => {
      setData(result);
      setLoading(false);
    });
  }, []);

  const loadingComponent = (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#FF4D67" />
    </View>
  );

  return (
    <ScreenContainer 
      title="My Screen" 
      showBackButton={true}
      rightButton={{
        display: true,
        name: "plus",
        action: () => console.log("Add button pressed")
      }}
      loading={loading}
      loadingComponent={loadingComponent}
      style={{ backgroundColor: '#f8f8f8' }}
    >
      {/* Your screen content goes here */}
      <Text>Screen content</Text>
    </ScreenContainer>
  );
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | (required) | The content to display in the screen |
| `title` | string | "" | The title to display in the navigation bar |
| `showBackButton` | boolean | true | Whether to show the back button in the navigation bar |
| `rightButton` | object | { display: false } | Configuration for the right button in the navigation bar |
| `style` | ViewStyle | undefined | Additional styles to apply to the content container |
| `loading` | boolean | false | Whether the screen is in a loading state |
| `loadingComponent` | ReactNode | undefined | Component to display when in loading state |

### rightButton Object

| Property | Type | Description |
|----------|------|-------------|
| `display` | boolean | Whether to display the right button |
| `name` | string | Icon name from Feather icon set |
| `action` | function | Function to call when the button is pressed |

## Safe Area Handling

The ScreenContainer uses SafeAreaView from react-native-safe-area-context for proper handling of safe areas on different devices:

- The outer SafeAreaView handles the top edge (status bar area)
- The inner SafeAreaView handles the bottom, left, and right edges
- This ensures content is properly inset on devices with notches, rounded corners, or home indicators

## Example

See `example.tsx` for a complete example of how to use the ScreenContainer component to recreate the Recipes screen.
