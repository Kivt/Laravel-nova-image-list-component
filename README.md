# Laravel nova image-list tool

## Installation

- Install package

``composer require vitb/image-list``

- Register tool inside `app/Providers/NovaServiceProvider`

```php
use Vb\ImageList\ImageList;

/**
 * Get the cards that should be listed in the Nova sidebar.
 *
 * @return array
 */
public function tools()
{
    return [
        new ImageList,
    ];
}
```
