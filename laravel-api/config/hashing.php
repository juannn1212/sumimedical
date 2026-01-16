<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Hash Driver
    |--------------------------------------------------------------------------
    |
    | This option controls the default hash driver that receives request for
    | password encryption. To achieve the most secure hash you generally
    | want to stick with the "bcrypt" driver. However, common drivers
    | are supported out of the box including Argon2 and Argon2id.
    |
    */

    'driver' => 'bcrypt',

    /*
    |--------------------------------------------------------------------------
    | Bcrypt Options
    |--------------------------------------------------------------------------
    |
    | Here you may specify the configuration options that should be used when
    | the passwords are hashed using the Bcrypt algorithm. This will allow
    | you to control the amount of time it takes to hash the given password.
    |
    */

    'bcrypt' => [
        'rounds' => env('BCRYPT_ROUNDS', 10),
    ],

    /*
    |--------------------------------------------------------------------------
    | Argon Options
    |--------------------------------------------------------------------------
    |
    | Here you may specify the configuration options that should be used when
    | the passwords are hashed using the Argon algorithm. These will allow
    | you to control the amount of time it takes to hash the given password.
    |
    */

    'argon' => [
        'memory' => 1024,
        'threads' => 2,
        'time' => 2,
    ],

];
