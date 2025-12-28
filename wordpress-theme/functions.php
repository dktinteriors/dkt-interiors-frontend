<?php
/**
 * DKT Interiors Theme Functions
 * Headless WordPress Backend for Next.js Frontend
 * 
 * @package DKT_Interiors
 * @version 2.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// ============================================
// Theme Setup
// ============================================

function dkt_theme_setup() {
    add_theme_support('post-thumbnails');
    add_theme_support('title-tag');
    add_theme_support('custom-logo');
    add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption'));
    
    // Register navigation menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'dkt-interiors-theme'),
        'footer' => __('Footer Menu', 'dkt-interiors-theme'),
    ));
    
    // Add custom image sizes
    add_image_size('portfolio-thumb', 400, 500, true);
    add_image_size('portfolio-large', 800, 1000, true);
    add_image_size('blog-thumb', 400, 250, true);
    add_image_size('hero-image', 1920, 1080, true);
    add_image_size('og-image', 1200, 630, true);
}
add_action('after_setup_theme', 'dkt_theme_setup');

// ============================================
// Enqueue Scripts & Styles (Minimal for headless)
// ============================================

function dkt_enqueue_assets() {
    wp_enqueue_style('dkt-style', get_stylesheet_uri(), array(), '2.0.0');
}
add_action('wp_enqueue_scripts', 'dkt_enqueue_assets');

// ============================================
// Portfolio Custom Post Type
// ============================================

function dkt_register_portfolio_post_type() {
    $labels = array(
        'name'               => 'Portfolio',
        'singular_name'      => 'Portfolio Item',
        'menu_name'          => 'Portfolio',
        'add_new'            => 'Add New',
        'add_new_item'       => 'Add New Project',
        'edit_item'          => 'Edit Project',
        'new_item'           => 'New Project',
        'view_item'          => 'View Project',
        'search_items'       => 'Search Portfolio',
        'not_found'          => 'No projects found',
        'not_found_in_trash' => 'No projects found in Trash',
    );

    $args = array(
        'labels'              => $labels,
        'public'              => true,
        'publicly_queryable'  => true,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'show_in_rest'        => true,
        'query_var'           => true,
        'rewrite'             => array('slug' => 'portfolio'),
        'capability_type'     => 'post',
        'has_archive'         => true,
        'hierarchical'        => false,
        'menu_position'       => 5,
        'menu_icon'           => 'dashicons-portfolio',
        'supports'            => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
    );

    register_post_type('portfolio', $args);
}
add_action('init', 'dkt_register_portfolio_post_type');

// ============================================
// Portfolio Category Taxonomy
// ============================================

function dkt_register_portfolio_taxonomy() {
    $labels = array(
        'name'              => 'Portfolio Categories',
        'singular_name'     => 'Portfolio Category',
        'search_items'      => 'Search Categories',
        'all_items'         => 'All Categories',
        'edit_item'         => 'Edit Category',
        'update_item'       => 'Update Category',
        'add_new_item'      => 'Add New Category',
        'new_item_name'     => 'New Category Name',
        'menu_name'         => 'Categories',
    );

    $args = array(
        'hierarchical'      => true,
        'labels'            => $labels,
        'show_ui'           => true,
        'show_admin_column' => true,
        'show_in_rest'      => true,
        'query_var'         => true,
        'rewrite'           => array('slug' => 'portfolio-category'),
    );

    register_taxonomy('portfolio_category', array('portfolio'), $args);
}
add_action('init', 'dkt_register_portfolio_taxonomy');

// ============================================
// Portfolio Meta Boxes
// ============================================

function dkt_add_portfolio_meta_boxes() {
    add_meta_box(
        'portfolio_details',
        'Project Details',
        'dkt_portfolio_details_callback',
        'portfolio',
        'normal',
        'high'
    );
    
    add_meta_box(
        'portfolio_gallery',
        'Project Gallery',
        'dkt_portfolio_gallery_callback',
        'portfolio',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'dkt_add_portfolio_meta_boxes');

function dkt_portfolio_details_callback($post) {
    wp_nonce_field('dkt_portfolio_details', 'dkt_portfolio_nonce');
    
    $meta_fields = array(
        'client' => get_post_meta($post->ID, '_portfolio_client', true),
        'year' => get_post_meta($post->ID, '_portfolio_year', true),
        'location' => get_post_meta($post->ID, '_portfolio_location', true),
        'project_type' => get_post_meta($post->ID, '_portfolio_project_type', true),
        'square_footage' => get_post_meta($post->ID, '_portfolio_square_footage', true),
        'duration' => get_post_meta($post->ID, '_portfolio_duration', true),
        'services' => get_post_meta($post->ID, '_portfolio_services', true),
        'featured' => get_post_meta($post->ID, '_portfolio_featured', true),
    );
    
    $project_types = array(
        'Residential Design',
        'Commercial Design',
        'Gut Renovation',
        'New Construction',
        'Decorative Interiors',
        'Full Service Interior Design',
    );
    ?>
    <table class="form-table">
        <tr>
            <th><label for="portfolio_client">Client Name</label></th>
            <td><input type="text" id="portfolio_client" name="portfolio_client" value="<?php echo esc_attr($meta_fields['client']); ?>" class="regular-text"></td>
        </tr>
        <tr>
            <th><label for="portfolio_year">Year</label></th>
            <td><input type="text" id="portfolio_year" name="portfolio_year" value="<?php echo esc_attr($meta_fields['year']); ?>" class="regular-text"></td>
        </tr>
        <tr>
            <th><label for="portfolio_location">Location</label></th>
            <td><input type="text" id="portfolio_location" name="portfolio_location" value="<?php echo esc_attr($meta_fields['location']); ?>" class="regular-text"></td>
        </tr>
        <tr>
            <th><label for="portfolio_project_type">Project Type</label></th>
            <td>
                <select id="portfolio_project_type" name="portfolio_project_type" class="regular-text">
                    <option value="">Select Type</option>
                    <?php foreach ($project_types as $type): ?>
                        <option value="<?php echo esc_attr($type); ?>" <?php selected($meta_fields['project_type'], $type); ?>><?php echo esc_html($type); ?></option>
                    <?php endforeach; ?>
                </select>
            </td>
        </tr>
        <tr>
            <th><label for="portfolio_square_footage">Square Footage</label></th>
            <td><input type="text" id="portfolio_square_footage" name="portfolio_square_footage" value="<?php echo esc_attr($meta_fields['square_footage']); ?>" class="regular-text" placeholder="e.g., 3,500 sq ft"></td>
        </tr>
        <tr>
            <th><label for="portfolio_duration">Duration</label></th>
            <td><input type="text" id="portfolio_duration" name="portfolio_duration" value="<?php echo esc_attr($meta_fields['duration']); ?>" class="regular-text" placeholder="e.g., 6 months"></td>
        </tr>
        <tr>
            <th><label for="portfolio_services">Services</label></th>
            <td><textarea id="portfolio_services" name="portfolio_services" class="large-text" rows="3" placeholder="List services provided..."><?php echo esc_textarea($meta_fields['services']); ?></textarea></td>
        </tr>
        <tr>
            <th><label for="portfolio_featured">Featured Project</label></th>
            <td>
                <input type="checkbox" id="portfolio_featured" name="portfolio_featured" value="1" <?php checked($meta_fields['featured'], '1'); ?>>
                <label for="portfolio_featured">Show on homepage</label>
            </td>
        </tr>
    </table>
    <?php
}

function dkt_portfolio_gallery_callback($post) {
    $gallery_images = get_post_meta($post->ID, '_portfolio_gallery', true);
    ?>
    <div id="portfolio-gallery-container">
        <p>Add multiple images to create a project gallery.</p>
        <button type="button" id="portfolio-gallery-button" class="button">Add Gallery Images</button>
        <input type="hidden" id="portfolio_gallery" name="portfolio_gallery" value="<?php echo esc_attr($gallery_images); ?>">
        <div id="portfolio-gallery-preview" style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 15px;">
            <?php
            if ($gallery_images) {
                $image_ids = explode(',', $gallery_images);
                foreach ($image_ids as $image_id) {
                    if ($image_id && is_numeric($image_id)) {
                        $image = wp_get_attachment_image($image_id, 'thumbnail');
                        if ($image) {
                            echo '<div class="gallery-image" data-id="' . esc_attr($image_id) . '" style="position: relative;">' . $image . '<button type="button" class="remove-image" style="position: absolute; top: -5px; right: -5px; background: #dc3232; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer;">&times;</button></div>';
                        }
                    }
                }
            }
            ?>
        </div>
    </div>
    
    <script>
    jQuery(document).ready(function($) {
        var mediaUploader;
        
        $('#portfolio-gallery-button').click(function(e) {
            e.preventDefault();
            
            if (mediaUploader) {
                mediaUploader.open();
                return;
            }
            
            mediaUploader = wp.media({
                title: 'Choose Gallery Images',
                button: { text: 'Add to Gallery' },
                multiple: true
            });
            
            mediaUploader.on('select', function() {
                var attachments = mediaUploader.state().get('selection').toJSON();
                var currentIds = $('#portfolio_gallery').val();
                var idsArray = currentIds ? currentIds.split(',') : [];
                
                attachments.forEach(function(attachment) {
                    if (attachment.id && idsArray.indexOf(attachment.id.toString()) === -1) {
                        idsArray.push(attachment.id);
                        var thumbnailUrl = attachment.sizes && attachment.sizes.thumbnail ? 
                            attachment.sizes.thumbnail.url : attachment.url;
                        $('#portfolio-gallery-preview').append(
                            '<div class="gallery-image" data-id="' + attachment.id + '" style="position: relative;">' +
                            '<img src="' + thumbnailUrl + '" style="width: 100px; height: 100px; object-fit: cover;">' +
                            '<button type="button" class="remove-image" style="position: absolute; top: -5px; right: -5px; background: #dc3232; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer;">&times;</button></div>'
                        );
                    }
                });
                
                $('#portfolio_gallery').val(idsArray.filter(Boolean).join(','));
            });
            
            mediaUploader.open();
        });
        
        $(document).on('click', '.remove-image', function() {
            var imageId = $(this).parent().data('id');
            var currentIds = $('#portfolio_gallery').val();
            var idsArray = currentIds ? currentIds.split(',') : [];
            var index = idsArray.indexOf(imageId.toString());
            
            if (index > -1) {
                idsArray.splice(index, 1);
            }
            
            $('#portfolio_gallery').val(idsArray.filter(Boolean).join(','));
            $(this).parent().remove();
        });
    });
    </script>
    <?php
}

function dkt_save_portfolio_meta($post_id) {
    if (!isset($_POST['dkt_portfolio_nonce']) || !wp_verify_nonce($_POST['dkt_portfolio_nonce'], 'dkt_portfolio_details')) {
        return;
    }
    
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    
    $fields = array('client', 'year', 'location', 'project_type', 'square_footage', 'duration', 'services', 'gallery');
    
    foreach ($fields as $field) {
        if (isset($_POST['portfolio_' . $field])) {
            update_post_meta($post_id, '_portfolio_' . $field, sanitize_text_field($_POST['portfolio_' . $field]));
        }
    }
    
    $featured = isset($_POST['portfolio_featured']) ? '1' : '0';
    update_post_meta($post_id, '_portfolio_featured', $featured);
}
add_action('save_post_portfolio', 'dkt_save_portfolio_meta');

// ============================================
// CORS Configuration for Headless
// ============================================

function dkt_cors_headers() {
    $allowed_origins = array(
        'http://localhost:3000',
        'https://dktinteriorsco.com',
        'https://www.dktinteriorsco.com',
    );
    
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
        header("Access-Control-Allow-Credentials: true");
    }
    
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        status_header(200);
        exit();
    }
}
add_action('rest_api_init', 'dkt_cors_headers');
add_action('init', 'dkt_cors_headers');

// ============================================
// REST API - Custom Endpoints
// ============================================

function dkt_register_rest_routes() {
    // Homepage Data
    register_rest_route('dkt/v1', '/homepage', array(
        'methods' => 'GET',
        'callback' => 'dkt_get_homepage_data',
        'permission_callback' => '__return_true',
    ));
    
    // Site Settings
    register_rest_route('dkt/v1', '/settings', array(
        'methods' => 'GET',
        'callback' => 'dkt_get_settings',
        'permission_callback' => '__return_true',
    ));
    
    // Featured Portfolio
    register_rest_route('dkt/v1', '/featured-portfolio', array(
        'methods' => 'GET',
        'callback' => 'dkt_get_featured_portfolio',
        'permission_callback' => '__return_true',
    ));
    
    // Related Portfolio
    register_rest_route('dkt/v1', '/portfolio/(?P<id>\d+)/related', array(
        'methods' => 'GET',
        'callback' => 'dkt_get_related_portfolio',
        'permission_callback' => '__return_true',
    ));
    
    // Services
    register_rest_route('dkt/v1', '/services', array(
        'methods' => 'GET',
        'callback' => 'dkt_get_services',
        'permission_callback' => '__return_true',
    ));
    
    // Testimonials
    register_rest_route('dkt/v1', '/testimonials', array(
        'methods' => 'GET',
        'callback' => 'dkt_get_testimonials',
        'permission_callback' => '__return_true',
    ));
    
    // Contact Form
    register_rest_route('dkt/v1', '/contact', array(
        'methods' => 'POST',
        'callback' => 'dkt_handle_contact_form',
        'permission_callback' => '__return_true',
    ));
    
    // Menus
    register_rest_route('dkt/v1', '/menus/(?P<location>[a-zA-Z0-9_-]+)', array(
        'methods' => 'GET',
        'callback' => 'dkt_get_menu',
        'permission_callback' => '__return_true',
    ));
}
add_action('rest_api_init', 'dkt_register_rest_routes');

// ============================================
// REST API Callbacks
// ============================================

function dkt_get_homepage_data() {
    // Create a mock REST request to get portfolio as REST response
    $portfolio_request = new WP_REST_Request('GET', '/dkt/v1/featured-portfolio');
    
    return array(
        'settings' => dkt_get_settings()->get_data(),
        'featured_portfolio' => dkt_get_featured_portfolio($portfolio_request)->get_data(),
        'services' => dkt_get_services()->get_data(),
        'testimonials' => dkt_get_testimonials()->get_data(),
    );
}

function dkt_get_settings() {
    return new WP_REST_Response(array(
        'name' => get_bloginfo('name'),
        'description' => get_bloginfo('description'),
        'contact' => array(
            'phone' => get_theme_mod('contact_phone', '732-882-3249'),
            'email' => get_theme_mod('contact_email', 'info@dktinteriorsco.com'),
            'address' => get_theme_mod('contact_address', 'Flower Mound, TX'),
        ),
        'social' => array(
            'instagram' => get_theme_mod('instagram_url', ''),
            'pinterest' => get_theme_mod('pinterest_url', ''),
        ),
        'hero' => array(
            'title' => get_theme_mod('hero_title', 'Where less becomes MORE'),
            'subtitle' => get_theme_mod('hero_subtitle', 'Creating sophisticated, modern interiors that reflect your unique style.'),
        ),
    ), 200);
}

function dkt_get_featured_portfolio($request = null) {
    // Determine the limit
    if (is_object($request) && method_exists($request, 'get_param')) {
        // Called from REST API
        $limit = $request->get_param('limit');
        $is_rest_request = true;
    } elseif (is_numeric($request)) {
        // Called directly with a number (e.g., from index.php)
        $limit = intval($request);
        $is_rest_request = false;
    } else {
        // Default - assume template call
        $limit = 6;
        $is_rest_request = false;
    }
    $limit = $limit ? intval($limit) : 6;
    
    $args = array(
        'post_type' => 'portfolio',
        'posts_per_page' => $limit,
        'meta_query' => array(
            array(
                'key' => '_portfolio_featured',
                'value' => '1',
                'compare' => '=',
            ),
        ),
        'orderby' => 'menu_order date',
        'order' => 'ASC',
    );
    
    $query = new WP_Query($args);
    
    // If called from template (index.php), return WP_Query object
    if (!$is_rest_request) {
        return $query;
    }
    
    // If called from REST API, return formatted response
    $items = array();
    
    while ($query->have_posts()) {
        $query->the_post();
        $items[] = dkt_format_portfolio_item(get_the_ID());
    }
    
    wp_reset_postdata();
    
    return new WP_REST_Response($items, 200);
}

function dkt_get_related_portfolio($request) {
    $post_id = $request->get_param('id');
    $limit = $request->get_param('limit') ? intval($request->get_param('limit')) : 3;
    
    $terms = wp_get_post_terms($post_id, 'portfolio_category', array('fields' => 'ids'));
    
    $args = array(
        'post_type' => 'portfolio',
        'posts_per_page' => $limit,
        'post__not_in' => array($post_id),
        'orderby' => 'rand',
    );
    
    if (!empty($terms)) {
        $args['tax_query'] = array(
            array(
                'taxonomy' => 'portfolio_category',
                'field' => 'term_id',
                'terms' => $terms,
            ),
        );
    }
    
    $query = new WP_Query($args);
    $items = array();
    
    while ($query->have_posts()) {
        $query->the_post();
        $items[] = dkt_format_portfolio_item(get_the_ID());
    }
    
    wp_reset_postdata();
    
    return new WP_REST_Response($items, 200);
}

function dkt_format_portfolio_item($post_id) {
    $thumbnail_id = get_post_thumbnail_id($post_id);
    
    return array(
        'id' => $post_id,
        'slug' => get_post_field('post_name', $post_id),
        'title' => get_the_title($post_id),
        'content' => apply_filters('the_content', get_post_field('post_content', $post_id)),
        'excerpt' => get_the_excerpt($post_id),
        'date' => get_the_date('c', $post_id),
        'modified' => get_the_modified_date('c', $post_id),
        'featured_image_urls' => dkt_get_image_urls($thumbnail_id),
        'gallery_images' => dkt_get_gallery_images($post_id),
        'portfolio_meta' => array(
            'client' => get_post_meta($post_id, '_portfolio_client', true),
            'year' => get_post_meta($post_id, '_portfolio_year', true),
            'location' => get_post_meta($post_id, '_portfolio_location', true),
            'project_type' => get_post_meta($post_id, '_portfolio_project_type', true),
            'square_footage' => get_post_meta($post_id, '_portfolio_square_footage', true),
            'duration' => get_post_meta($post_id, '_portfolio_duration', true),
            'services' => get_post_meta($post_id, '_portfolio_services', true),
            'featured' => get_post_meta($post_id, '_portfolio_featured', true) === '1',
        ),
        'portfolio_categories' => dkt_get_portfolio_categories($post_id),
    );
}

function dkt_get_image_urls($attachment_id) {
    if (!$attachment_id) {
        return null;
    }
    
    $sizes = array('thumbnail', 'medium', 'large', 'full', 'portfolio-thumb', 'portfolio-large', 'hero-image', 'og-image');
    $urls = array();
    
    foreach ($sizes as $size) {
        $image = wp_get_attachment_image_src($attachment_id, $size);
        if ($image) {
            $urls[$size] = array(
                'url' => $image[0],
                'width' => $image[1],
                'height' => $image[2],
            );
        }
    }
    
    $urls['alt'] = get_post_meta($attachment_id, '_wp_attachment_image_alt', true);
    
    return $urls;
}

function dkt_get_gallery_images($post_id) {
    $gallery_ids = get_post_meta($post_id, '_portfolio_gallery', true);
    
    if (!$gallery_ids) {
        return array();
    }
    
    $ids = array_filter(explode(',', $gallery_ids));
    $images = array();
    
    foreach ($ids as $id) {
        $id = intval($id);
        if (!$id) continue;
        
        $images[] = array(
            'id' => $id,
            'alt' => get_post_meta($id, '_wp_attachment_image_alt', true),
            'caption' => wp_get_attachment_caption($id),
            'urls' => array(
                'thumbnail' => wp_get_attachment_image_url($id, 'thumbnail'),
                'medium' => wp_get_attachment_image_url($id, 'medium'),
                'large' => wp_get_attachment_image_url($id, 'large'),
                'full' => wp_get_attachment_image_url($id, 'full'),
                'portfolio-large' => wp_get_attachment_image_url($id, 'portfolio-large'),
            ),
        );
    }
    
    return $images;
}

function dkt_get_portfolio_categories($post_id) {
    $terms = wp_get_post_terms($post_id, 'portfolio_category');
    $categories = array();
    
    foreach ($terms as $term) {
        $categories[] = array(
            'id' => $term->term_id,
            'name' => $term->name,
            'slug' => $term->slug,
        );
    }
    
    return $categories;
}

function dkt_get_services() {
    $services = array(
        array(
            'id' => 1,
            'title' => 'Residential Design',
            'description' => 'Complete home transformations that reflect your lifestyle and aesthetic preferences.',
            'icon' => 'home',
            'slug' => 'residential-design',
        ),
        array(
            'id' => 2,
            'title' => 'Commercial Design',
            'description' => 'Professional spaces that enhance productivity and create lasting impressions.',
            'icon' => 'building',
            'slug' => 'commercial-design',
        ),
        array(
            'id' => 3,
            'title' => 'Design Consultation',
            'description' => 'Expert guidance and direction for your design projects, big or small.',
            'icon' => 'message-circle',
            'slug' => 'design-consultation',
        ),
        array(
            'id' => 4,
            'title' => 'Space Planning',
            'description' => 'Optimized layouts that maximize functionality and flow in every room.',
            'icon' => 'layout',
            'slug' => 'space-planning',
        ),
    );
    
    return new WP_REST_Response($services, 200);
}

function dkt_get_testimonials() {
    $testimonials = array(
        array(
            'id' => 1,
            'content' => 'DKT Interiors transformed our home into something beyond our wildest dreams. Their attention to detail and understanding of our vision was exceptional.',
            'author' => 'Sarah M.',
            'location' => 'Flower Mound, TX',
            'project' => 'Whole Home Renovation',
        ),
        array(
            'id' => 2,
            'content' => 'Working with DKT was an absolute pleasure. They managed every detail seamlessly and delivered a space that perfectly reflects our family\'s lifestyle.',
            'author' => 'Michael & Jennifer T.',
            'location' => 'Highland Village, TX',
            'project' => 'Kitchen & Living Room',
        ),
        array(
            'id' => 3,
            'content' => 'The team at DKT brought a level of sophistication and warmth to our office that has truly elevated our business environment.',
            'author' => 'David R.',
            'location' => 'Lewisville, TX',
            'project' => 'Commercial Office Design',
        ),
    );
    
    return new WP_REST_Response($testimonials, 200);
}

function dkt_handle_contact_form($request) {
    $params = $request->get_json_params();
    
    // Check honeypot
    if (!empty($params['website'])) {
        return new WP_REST_Response(array(
            'success' => false,
            'message' => 'Spam detected',
        ), 400);
    }
    
    // Validate required fields
    $required = array('name', 'email', 'message');
    foreach ($required as $field) {
        if (empty($params[$field])) {
            return new WP_REST_Response(array(
                'success' => false,
                'message' => ucfirst($field) . ' is required',
            ), 400);
        }
    }
    
    // Validate email
    if (!is_email($params['email'])) {
        return new WP_REST_Response(array(
            'success' => false,
            'message' => 'Invalid email address',
        ), 400);
    }
    
    // Prepare email
    $to = get_theme_mod('contact_email', get_option('admin_email'));
    $subject = 'New Contact Form Submission from ' . sanitize_text_field($params['name']);
    
    $body = "Name: " . sanitize_text_field($params['name']) . "\n";
    $body .= "Email: " . sanitize_email($params['email']) . "\n";
    
    if (!empty($params['phone'])) {
        $body .= "Phone: " . sanitize_text_field($params['phone']) . "\n";
    }
    
    if (!empty($params['project_type'])) {
        $body .= "Project Type: " . sanitize_text_field($params['project_type']) . "\n";
    }
    
    $body .= "\nMessage:\n" . sanitize_textarea_field($params['message']);
    
    $headers = array(
        'Content-Type: text/plain; charset=UTF-8',
        'Reply-To: ' . sanitize_email($params['email']),
    );
    
    $sent = wp_mail($to, $subject, $body, $headers);
    
    if ($sent) {
        return new WP_REST_Response(array(
            'success' => true,
            'message' => 'Thank you! Your message has been sent successfully.',
        ), 200);
    }
    
    return new WP_REST_Response(array(
        'success' => false,
        'message' => 'Failed to send message. Please try again.',
    ), 500);
}

function dkt_get_menu($request) {
    $location = $request->get_param('location');
    $locations = get_nav_menu_locations();
    
    if (!isset($locations[$location])) {
        return new WP_REST_Response(array(
            'name' => $location,
            'items' => array(),
        ), 200);
    }
    
    $menu_items = wp_get_nav_menu_items($locations[$location]);
    
    if (!$menu_items) {
        return new WP_REST_Response(array(
            'name' => $location,
            'items' => array(),
        ), 200);
    }
    
    $items = array();
    foreach ($menu_items as $item) {
        $items[] = array(
            'id' => $item->ID,
            'title' => $item->title,
            'url' => $item->url,
            'target' => $item->target,
        );
    }
    
    return new WP_REST_Response(array(
        'name' => $location,
        'items' => $items,
    ), 200);
}

// ============================================
// Add Portfolio Data to REST API Response
// ============================================

function dkt_register_portfolio_rest_fields() {
    register_rest_field('portfolio', 'portfolio_meta', array(
        'get_callback' => function($post) {
            return array(
                'client' => get_post_meta($post['id'], '_portfolio_client', true),
                'year' => get_post_meta($post['id'], '_portfolio_year', true),
                'location' => get_post_meta($post['id'], '_portfolio_location', true),
                'project_type' => get_post_meta($post['id'], '_portfolio_project_type', true),
                'square_footage' => get_post_meta($post['id'], '_portfolio_square_footage', true),
                'duration' => get_post_meta($post['id'], '_portfolio_duration', true),
                'services' => get_post_meta($post['id'], '_portfolio_services', true),
                'featured' => get_post_meta($post['id'], '_portfolio_featured', true) === '1',
            );
        },
    ));
    
    register_rest_field('portfolio', 'featured_image_urls', array(
        'get_callback' => function($post) {
            return dkt_get_image_urls(get_post_thumbnail_id($post['id']));
        },
    ));
    
    register_rest_field('portfolio', 'gallery_images', array(
        'get_callback' => function($post) {
            return dkt_get_gallery_images($post['id']);
        },
    ));
    
    register_rest_field('portfolio', 'portfolio_categories', array(
        'get_callback' => function($post) {
            return dkt_get_portfolio_categories($post['id']);
        },
    ));
}
add_action('rest_api_init', 'dkt_register_portfolio_rest_fields');

// ============================================
// Customizer Settings
// ============================================

function dkt_customizer_settings($wp_customize) {
    // Contact Section
    $wp_customize->add_section('dkt_contact', array(
        'title' => 'Contact Information',
        'priority' => 30,
    ));
    
    $wp_customize->add_setting('contact_phone', array(
        'default' => '732-882-3249',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    
    $wp_customize->add_control('contact_phone', array(
        'label' => 'Phone Number',
        'section' => 'dkt_contact',
        'type' => 'text',
    ));
    
    $wp_customize->add_setting('contact_email', array(
        'default' => 'info@dktinteriorsco.com',
        'sanitize_callback' => 'sanitize_email',
    ));
    
    $wp_customize->add_control('contact_email', array(
        'label' => 'Email Address',
        'section' => 'dkt_contact',
        'type' => 'email',
    ));
    
    $wp_customize->add_setting('contact_address', array(
        'default' => 'Flower Mound, TX',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    
    $wp_customize->add_control('contact_address', array(
        'label' => 'Address',
        'section' => 'dkt_contact',
        'type' => 'text',
    ));
    
    // Social Media Section
    $wp_customize->add_section('dkt_social', array(
        'title' => 'Social Media',
        'priority' => 35,
    ));
    
    $wp_customize->add_setting('instagram_url', array(
        'default' => '',
        'sanitize_callback' => 'esc_url_raw',
    ));
    
    $wp_customize->add_control('instagram_url', array(
        'label' => 'Instagram URL',
        'section' => 'dkt_social',
        'type' => 'url',
    ));
    
    $wp_customize->add_setting('pinterest_url', array(
        'default' => '',
        'sanitize_callback' => 'esc_url_raw',
    ));
    
    $wp_customize->add_control('pinterest_url', array(
        'label' => 'Pinterest URL',
        'section' => 'dkt_social',
        'type' => 'url',
    ));
    
    // Hero Section
    $wp_customize->add_section('dkt_hero', array(
        'title' => 'Hero Section',
        'priority' => 40,
    ));
    
    $wp_customize->add_setting('hero_title', array(
        'default' => 'Where less becomes MORE',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    
    $wp_customize->add_control('hero_title', array(
        'label' => 'Hero Title',
        'section' => 'dkt_hero',
        'type' => 'text',
    ));
    
    $wp_customize->add_setting('hero_subtitle', array(
        'default' => 'Creating sophisticated, modern interiors that reflect your unique style.',
        'sanitize_callback' => 'sanitize_textarea_field',
    ));
    
    $wp_customize->add_control('hero_subtitle', array(
        'label' => 'Hero Subtitle',
        'section' => 'dkt_hero',
        'type' => 'textarea',
    ));
}
add_action('customize_register', 'dkt_customizer_settings');

// ============================================
// Admin Enhancements
// ============================================

function dkt_admin_scripts() {
    wp_enqueue_media();
}
add_action('admin_enqueue_scripts', 'dkt_admin_scripts');

// ============================================
// Security Headers
// ============================================

function dkt_security_headers() {
    if (!is_admin()) {
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: SAMEORIGIN');
        header('X-XSS-Protection: 1; mode=block');
    }
}
add_action('send_headers', 'dkt_security_headers');
