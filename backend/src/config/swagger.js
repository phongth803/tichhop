import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-Commerce API',
      version: '1.0.0',
      description: 'API documentation for E-Commerce application'
    },
    servers: [
      {
        url: 'http://localhost:3002/api',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'password', 'firstName', 'lastName'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 6,
              description: 'User password'
            },
            firstName: {
              type: 'string',
              description: 'User first name'
            },
            lastName: {
              type: 'string',
              description: 'User last name'
            },
            phone: {
              type: 'string',
              description: 'User phone number'
            },
            address: {
              type: 'string',
              description: 'User address'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              default: 'user',
              description: 'User role'
            },
            isActive: {
              type: 'boolean',
              default: true,
              description: 'User account status'
            }
          }
        },
        Product: {
          type: 'object',
          required: ['name', 'price', 'category'],
          properties: {
            name: {
              type: 'string',
              description: 'Product name'
            },
            description: {
              type: 'string',
              description: 'Product description'
            },
            price: {
              type: 'number',
              minimum: 0,
              description: 'Product price'
            },
            category: {
              type: 'string',
              description: 'Category ID'
            },
            stock: {
              type: 'number',
              minimum: 0,
              default: 0,
              description: 'Product stock quantity'
            },
            images: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array of image URLs'
            },
            isActive: {
              type: 'boolean',
              default: true,
              description: 'Product status'
            }
          }
        },
        Category: {
          type: 'object',
          required: ['name', 'description'],
          properties: {
            name: {
              type: 'string',
              description: 'Category name'
            },
            description: {
              type: 'string',
              description: 'Category description'
            },
            isActive: {
              type: 'boolean',
              default: true,
              description: 'Category status'
            }
          }
        },
        Cart: {
          type: 'object',
          required: ['user', 'items'],
          properties: {
            user: {
              type: 'string',
              description: 'User ID'
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  product: {
                    type: 'string',
                    description: 'Product ID'
                  },
                  quantity: {
                    type: 'number',
                    minimum: 1,
                    description: 'Quantity of product'
                  }
                }
              }
            }
          }
        },
        Order: {
          type: 'object',
          required: ['user', 'items', 'totalAmount', 'shippingAddress'],
          properties: {
            user: {
              type: 'string',
              description: 'User ID'
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  product: {
                    type: 'string',
                    description: 'Product ID'
                  },
                  quantity: {
                    type: 'number',
                    minimum: 1,
                    description: 'Quantity ordered'
                  },
                  price: {
                    type: 'number',
                    minimum: 0,
                    description: 'Price at time of order'
                  }
                }
              }
            },
            totalAmount: {
              type: 'number',
              minimum: 0,
              description: 'Total order amount'
            },
            status: {
              type: 'string',
              enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
              default: 'pending',
              description: 'Order status'
            },
            shippingAddress: {
              type: 'object',
              properties: {
                street: {
                  type: 'string',
                  description: 'Street address'
                },
                city: {
                  type: 'string',
                  description: 'City'
                },
                state: {
                  type: 'string',
                  description: 'State/Province'
                },
                zipCode: {
                  type: 'string',
                  description: 'ZIP/Postal code'
                },
                country: {
                  type: 'string',
                  description: 'Country'
                }
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Order creation date'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Order last update date'
            }
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.js'] // đường dẫn tới các file routes
}

export const specs = swaggerJsdoc(options)
