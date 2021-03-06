const colors =  require('colors');
const dotenv = require('dotenv')
const express = require('express')
const path = require('path')

const connectDB = require('./config/db')

const adminRoutes = require('./routes/adminRoutes')
const userRoutes = require('./routes/userRoutes')
const retailerRoutes = require('./routes/retailerRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const productRoutes = require('./routes/productRoutes')
const dealsRoutes = require('./routes/dealsRoutes')
const homepageRoutes = require('./routes/homepageRoutes')
const uploadRoutes = require('./routes/uploadRoutes')
const cartRoutes = require('./routes/cartRoutes')
const orderRoutes = require('./routes/orderRoutes')
const errorHandler = require('./middleware/errorMiddleWare')

dotenv.config();

const app = express()

app.use(express.json());

connectDB()

app.use('/api/admin', adminRoutes)
app.use('/api/users', userRoutes)
app.use('/api/retailers', retailerRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/products', productRoutes)
app.use('/api/deals', dealsRoutes)
app.use('/api/homepage', homepageRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)

app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.use(errorHandler.notFound)
app.use(errorHandler.errorHandler)

app.listen(
    process.env.PORT || 5000,
    console.log(
      `Server started in ${process.env.NODE_ENV} on PORT ${process.env.PORT}`
        .green.bold.underline
    )
  );
  