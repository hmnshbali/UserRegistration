import React, { useEffect } from 'react';
import {
    TextField, Button, RadioGroup, FormControlLabel, Radio,
    FormControl, FormHelperText, FormLabel, MenuItem, Select, InputLabel,
    Grid, IconButton, Box, Typography, Container, Paper, Divider
} from '@mui/material';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Add, Remove } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useUsers } from '../context/userContext';
import { useLocation, useNavigate } from 'react-router-dom';


const schema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email().required('Email is required'),
    gender: yup.string().required('Gender is required'),
    dob: yup
        .date()
        .nullable()
        .required('Date of birth is required')
        .test(
            'age',
            'You must be at least 18 years old',
            (value) => {
                if (!value) return false; // required validation handles this
                const today = dayjs();
                const birthDate = dayjs(value);
                const age = today.diff(birthDate, 'year');
                return age >= 18;
            }
        ),
    profileType: yup.string().required('Profile type is required'),

    phoneNumbers: yup.array().of(
        yup
            .string()
            .matches(
                /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/,
                'Invalid phone number!'
            )
            .required('Phone number is required')
    ),

    addresses: yup.array().of(
        yup.object().shape({
            street: yup.string().required('Street is required'),
            city: yup.string().required('City is required'),
            state: yup.string().required('State is required'),
            zip: yup.string().max(6, 'ZIP Code must be 6 digits').required('ZIP Code is required')
        })
    ),

    relatives: yup.array().of(
        yup.object().shape({
            name: yup.string().required('Name is required'),
            relationship: yup.string().required('Relationship is required'),
            age: yup
                .number()
                .typeError('Age is required')
                .required('Age is required'),
        })
    ),
});

const EditDetails = () => {
    const { editUser } = useUsers();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = location.state || {};
    console.log(user);
    

    const {
        register,
        control,
        handleSubmit,
        reset,
        trigger,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: user,
    });

    const {
        fields: phoneFields,
        append: addPhone,
        remove: removePhone,
    } = useFieldArray({ control, name: 'phoneNumbers' });

    const {
        fields: addressFields,
        append: addAddress,
        remove: removeAddress,
    } = useFieldArray({ control, name: 'addresses' });

    const {
        fields: relativeFields,
        append: addRelative,
        remove: removeRelative,
    } = useFieldArray({ control, name: 'relatives' });

    useEffect(() => {
        if (user)
        reset(user);
        else navigate('/');
    }, [user, reset, navigate]);

    const onSubmit = (data) => {
        editUser(data);
        navigate('/');
    };

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Edit User Details
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        {/* First & Last Name */}
                        <Grid sx={{ width: { xs: '100%', md: '48%', sm: '48%', } }}>
                            <TextField
                                label="First Name"
                                fullWidth
                                {...register('firstName')}
                                error={!!errors.firstName}
                                helperText={errors.firstName?.message}
                            />
                        </Grid>
                        <Grid sx={{ width: { xs: '100%', md: '48%', sm: '48%', } }}>
                            <TextField
                                label="Last Name"
                                fullWidth
                                {...register('lastName')}
                                error={!!errors.lastName}
                                helperText={errors.lastName?.message}
                            />
                        </Grid>

                        {/* Email */}
                        <Grid sx={{ width: { xs: '100%', md: '48%', sm: '48%', } }}>
                            <TextField
                                label="Email"
                                fullWidth
                                {...register('email')}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        </Grid>

                        {/* Passwords */}
                        <Grid sx={{ width: { xs: '100%', md: '48%', sm: '48%', } }}>

                            <TextField
                                label="Password"
                                type="password"
                                fullWidth

                                {...register('password')}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        </Grid>

                        {/* Gender */}
                        <Grid sx={{ width: { xs: '100%', md: '48%', sm: '48%', } }}>
                            <FormControl component="fieldset" error={!!errors.gender}>
                                <FormLabel component="legend">Gender</FormLabel>
                                <Controller
                                    control={control}
                                    name="gender"
                                    render={({ field }) => (
                                        <RadioGroup row {...field}>
                                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                                        </RadioGroup>
                                    )}
                                />
                            </FormControl>
                        </Grid>

                        {/* DOB and Profile Type */}
                        <Grid sx={{ width: { xs: '100%', md: '48%', sm: '48%', } }}>
                            <Controller
                                name="dob"
                                control={control}
                                defaultValue={null}
                                render={({ field }) => (
                                    <DatePicker
                                        label="Date of Birth"
                                        value={field.value ? dayjs(field.value) : null}
                                        onChange={(date) => {
                                            field.onChange(date ? date.toISOString() : null);
                                            trigger('dob');
                                        }}
 
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: !!errors.dob,
                                                helperText: errors.dob?.message,
                                            },
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid sx={{ width: { xs: '100%', md: '100%', sm: '100%', } }}>
                            <FormControl fullWidth error={!!errors.profileType}>
                                <InputLabel>Profile Type</InputLabel>
                                <Controller
                                    name="profileType"
                                    control={control}
                                    render={({ field }) => ( 
                                        <Select {...field} label="Profile Type"> 
                                            <MenuItem value="personal">Personal</MenuItem>
                                            <MenuItem value="business">Business</MenuItem>
                                        </Select>
                                    )}
                                /> 
                                <FormHelperText>{errors.profileType?.message}</FormHelperText>
                            </FormControl>
                        </Grid>


                        {/* Phone Numbers */}
                        <Grid width={'100%'}>
                            <Typography variant="h6" mt={4}>
                                Phone Numbers
                            </Typography>
                            {phoneFields.map((field, index) => (
                                <Paper
                                    key={field.id}
                                    sx={{
                                        p: 2,
                                        mt: 2,
                                        border: '1px solid #ccc',
                                        borderRadius: 2,
                                        backgroundColor: '#fafafa',
                                    }}
                                >
                                    <Grid container spacing={5} alignItems="center">
                                        <Grid >
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Phone Number"
                                                {...register(`phoneNumbers.${index}`)}
                                                error={!!errors.phoneNumbers?.[index]}
                                                helperText={errors.phoneNumbers?.[index]?.message}
                                            />
                                        </Grid>
                                        <Grid >
                                            <Box display="flex" gap={1}>
                                                <IconButton
                                                    onClick={() => removePhone(index)}
                                                    disabled={phoneFields.length === 1}
                                                    color="error"
                                                >
                                                    <Remove />
                                                </IconButton>
                                                <IconButton onClick={() => addPhone('')} color="primary">
                                                    <Add />
                                                </IconButton>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            ))}
                        </Grid>

                        {/* Addresses */}
                        <Grid >
                            <Typography variant="h6" mt={4}>
                                Addresses
                            </Typography>
                            {addressFields.map((field, index) => (
                                <Paper key={field.id} sx={{ p: 2, mt: 2, border: '1px solid #ccc' }}>
                                    <Grid container spacing={2}>
                                        <Grid sx={{ width: { xs: '100%', md: '32%', sm: '48%', } }}>

                                            <TextField
                                                label="Street"
                                                fullWidth
                                                {...register(`addresses.${index}.street`)}
                                                error={!!errors.addresses?.[index]?.street}
                                                helperText={errors.addresses?.[index]?.street?.message}
                                            />
                                        </Grid>
                                        <Grid sx={{ width: { xs: '100%', md: '32%', sm: '48%', } }}>
                                            <TextField
                                                label="City"
                                                fullWidth
                                                {...register(`addresses.${index}.city`)}
                                                error={!!errors.addresses?.[index]?.city}
                                                helperText={errors.addresses?.[index]?.city?.message}
                                            />
                                        </Grid>
                                        <Grid >
                                            <TextField
                                                label="State"
                                                fullWidth
                                                {...register(`addresses.${index}.state`)}
                                                error={!!errors.addresses?.[index]?.state}
                                                helperText={errors.addresses?.[index]?.state?.message}
                                            />
                                        </Grid>
                                        <Grid >
                                            <TextField
                                                label="ZIP Code"
                                                type="number"
                                                fullWidth
                                                {...register(`addresses.${index}.zip`)}
                                                error={!!errors.addresses?.[index]?.zip}
                                                helperText={errors.addresses?.[index]?.zip?.message}
                                            />
                                        </Grid>
                                        <Grid >
                                            <IconButton onClick={() => removeAddress(index)} disabled={addressFields.length === 1}>
                                                <Remove />
                                            </IconButton>
                                            <IconButton onClick={() => addAddress({ street: '', city: '', state: '', zip: '' })}>
                                                <Add />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            ))}
                        </Grid>

                        {/* Relatives */}
                        <Grid width={'100%'} >
                            <Typography variant="h6" mt={4}>
                                Relatives
                            </Typography>
                            {relativeFields.map((field, index) => (
                                <Paper key={field.id} sx={{ p: 2, mt: 2, border: '1px solid #ccc' }}>
                                    <Grid container spacing={2}>
                                        <Grid >
                                            <TextField
                                                label="Name"
                                                fullWidth
                                                {...register(`relatives.${index}.name`)}
                                                error={!!errors.relatives?.[index]?.name}
                                                helperText={errors.relatives?.[index]?.name?.message}
                                            />
                                        </Grid>
                                        <Grid width={'20%'}>
                                            <FormControl fullWidth>
                                                <InputLabel>Relationship</InputLabel>
                                                <Controller
                                                    name={`relatives.${index}.relationship`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select {...field} label="Relationship">
                                                            <MenuItem value="parent">Parent</MenuItem>
                                                            <MenuItem value="sibling">Sibling</MenuItem>
                                                            <MenuItem value="child">Child</MenuItem>
                                                        </Select>
                                                    )}
                                                />
                                                <FormHelperText>{errors.relatives?.[index]?.relationship?.message}</FormHelperText>
                                            </FormControl>
                                        </Grid>
                                        <Grid  >
                                            <TextField
                                                label="Age"
                                                type="number"
                                                fullWidth
                                                {...register(`relatives.${index}.age`)}
                                                error={!!errors.relatives?.[index]?.age}
                                                helperText={errors.relatives?.[index]?.age?.message}
                                            />
                                        </Grid>
                                        <Grid >
                                            <IconButton onClick={() => removeRelative(index)} disabled={relativeFields.length === 1}>
                                                <Remove />
                                            </IconButton>
                                            <IconButton onClick={() => addRelative({ name: '', relationship: '', age: '' })}>
                                                <Add />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            ))}
                        </Grid>

                        {/* Submit */}
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
                                Save Changes
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default EditDetails;
