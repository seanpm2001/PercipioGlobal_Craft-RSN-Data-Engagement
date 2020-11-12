<?php
/**
 * RSN Data Engagement plugin for Craft CMS 3.x
 *
 * A comprehensive Data FieldType for the Research School Network
 *
 * @link      https://percipio.london
 * @copyright Copyright (c) 2020 Percipio Global Ltd
 */

namespace percipioglobal\rsndataengagement\services;

use percipioglobal\rsndataengagement\RsnDataEngagement;

use Craft;
use craft\base\Component;

/**
 * RsnDataEngagementService Service
 *
 * All of your plugin’s business logic should go in services, including saving data,
 * retrieving data, etc. They provide APIs that your controllers, template variables,
 * and other plugins can interact with.
 *
 * https://craftcms.com/docs/plugins/services
 *
 * @author    Percipio Global Ltd
 * @package   RsnDataEngagement
 * @since     1.0.0
 */
class RsnDataEngagementService extends Component
{
    // Public Methods
    // =========================================================================

    /**
     * This function can literally be anything you want, and you can have as many service
     * functions as you want
     *
     * From any other plugin file, call it like this:
     *
     *     RsnDataEngagement::$plugin->rsnDataEngagementService->exampleService()
     *
     * @return mixed
     */
    public function exampleService()
    {
        // $result = 'something';
        // Check our Plugin's settings for `someAttribute`
        // if (RsnDataEngagement::$plugin->getSettings()->someAttribute) {
        
        // }

        return $result;
    }
}
