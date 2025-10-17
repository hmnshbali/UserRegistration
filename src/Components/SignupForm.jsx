import React, { useState, useEffect } from 'react';
import { TextField, Button, RadioGroup, FormControlLabel, Radio, FormControl, FormHelperText, FormLabel, MenuItem, Select, InputLabel, Grid, IconButton, Box, Typography, Container, Paper, Divider } from '@mui/material';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Add, Remove } from '@mui/icons-material';
import dayjs from 'dayjs';
import { useUsers } from '../context/UserContext';

import { useNavigate } from 'react-router-dom';


const schema = yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().matches(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/,
        'Password must be at least 6 characters and include an uppercase letter, number, and special character'
    ).min(6).required(),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match'),
    gender: yup.string().required(),
    dob: yup
        .date()
        .nullable()
        .required('Date of birth is required'),

    profileType: yup.string().required('Profile type is required'),
    phoneNumbers: yup.array().of(
        yup.string()
            .matches(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/, {
                message: "Invalid Phone Number!",
            })
            .required("Phone Number Required !")
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
            age: yup.number().typeError('Age is required').required('Age is required'),
        })
    ),
    documents: yup.array().of(
        yup.object().shape({
            type: yup.string().required('Document type is required'),

        })
    ),
});

const SignupForm = () => {
    const navigate = useNavigate();


    const {
        register,
        control,
        handleSubmit,
        reset,
        trigger,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            gender: '',
            dob: null,
            profileType: '',
            phoneNumbers: [''],
            addresses: [{ street: '', city: '', state: '', zip: '' }],
            relatives: [{ name: '', relationship: '', age: '' }],
            documents: [
                { type: 'license', file: null },
                { type: 'adhar', file: null },
                { type: 'birthcert', file: null },
                { type: 'married', file: null },
            ]
        },
    });


    const { fields: phonefields, append: addphone, remove: removephone } = useFieldArray({ control, name: 'phoneNumbers' });

    const { fields: addressFields, append: addAddress, remove: removeAddress } = useFieldArray({ control, name: 'addresses' });

    const { fields: relativeFields, append: addRelative, remove: removeRelative } = useFieldArray({ control, name: 'relatives' });
    const { fields: documentFields } = useFieldArray({ control, name: 'documents' });
    const { addUser } = useUsers();

    // console.log(documentFields);

    const dob = watch('dob');
    const isAdult = dob ? dayjs().diff(dayjs(watch('dob')), 'year') >= 18 : false;

    const isMinor = dob ? dayjs().diff(dayjs(watch('dob')), 'year') < 18 : false;
    // console.log(isMinor);


    const onSubmit = (data) => {
        console.log('clicked');
        data.id = Date.now();
        console.log(data);
        addUser(data);
        reset({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            gender: '',
            dob: null,
            profileType: '',
            phoneNumbers: [''],
            addresses: [{ street: '', city: '', state: '', zip: '' }],
            relatives: [{ name: '', relationship: '', age: '' }],
            documents: [
                { type: '', file: null },
                { type: '', file: null },
                { type: '', file: null },
                { type: '', file: null },
            ]

        });
        navigate('/');
    };



    useEffect(() => {
        if (phonefields.length < 1) {
            addphone('');
        }
    }, [phonefields.length, addphone]);


    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    User Registration
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

                        <Grid sx={{ width: { xs: '100%', md: '48%', sm: '48%', } }}>
                            <TextField
                                label="Confirm Password"
                                type="password"
                                fullWidth
                                {...register('confirmPassword')}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword?.message}
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

                        <Grid sx={{ width: { xs: '100%', md: '48%', sm: '48%', } }}>
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

                        <Grid container spacing={2}>
                            {isAdult &&
                                documentFields
                                    .filter((field) => field.type === 'license' || field.type === 'adhar')
                                    .map((field, index) => (
                                        <Grid item xs={12} sm={field.type === 'license' ? 8 : 4} key={field.id}>

                                            {field.type === 'license' && (
                                                <>
                                                    <Typography variant="subtitle1" gutterBottom>
                                                        Upload License
                                                    </Typography>
                                                    <Button variant="outlined" component="label">
                                                        Choose File
                                                        <input
                                                            type="file"
                                                            hidden
                                                            accept="image/*,application/pdf"
                                                            onChange={(e) => {
                                                                setValue(`documents.${index}.file`, e.target.files[0], {
                                                                    shouldValidate: true,
                                                                });
                                                            }}
                                                        />
                                                    </Button>
                                                    {watch(`documents.${index}.file`)?.name && (
                                                        <Typography variant="body2" mt={1}>
                                                            Selected: {watch(`documents.${index}.file`)?.name}
                                                        </Typography>
                                                    )}
                                                </>
                                            )}

                                            {field.type === 'adhar' && (
                                                <>
                                                    <Typography variant="subtitle1" gutterBottom>
                                                        Upload Aadhar
                                                    </Typography>
                                                    <Button variant="outlined" component="label">
                                                        Choose File
                                                        <input
                                                            type="file"
                                                            hidden
                                                            accept="image/*,application/pdf"
                                                            onChange={(e) => {
                                                                setValue(`documents.${index}.file`, e.target.files[0], {
                                                                    shouldValidate: true,
                                                                });
                                                            }}
                                                        />
                                                    </Button>
                                                    {watch(`documents.${index}.file`)?.name && (
                                                        <Typography variant="body2" mt={1}>
                                                            Selected: {watch(`documents.${index}.file`)?.name}
                                                        </Typography>
                                                    )}
                                                </>
                                            )}

                                        </Grid>
                                    ))}
                        </Grid>




                        {isMinor && documentFields.map((field, index) => (
                            <div key={field.id}>
                                {field.type === 'birthcert' && (
                                    <>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Upload Birth Certificate
                                        </Typography>
                                        <Button variant="outlined" component="label">
                                            Choose File
                                            <input
                                                type="file"
                                                hidden
                                                accept="image/*,application/pdf"
                                                onChange={(e) => {
                                                    setValue(`documents.${index}.file`, e.target.files[0], {
                                                        shouldValidate: true,
                                                    });
                                                }}
                                            />
                                        </Button>
                                        {watch(`documents.${index}.file`)?.name && (
                                            <Typography variant="body2" mt={1}>
                                                Selected: {watch(`documents.${index}.file`)?.name}
                                            </Typography>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}



                        {/* Phone Numbers */}
                        <Grid width={'100%'}>
                            <Typography variant="h6" mt={4}>
                                Phone Numbers
                            </Typography>
                            {phonefields.map((field, index) => (
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
                                                    onClick={() => removephone(index)}
                                                    disabled={phonefields.length === 1}
                                                    color="error"
                                                >
                                                    <Remove />
                                                </IconButton>
                                                <IconButton onClick={() => addphone('')} color="primary">
                                                    <Add />
                                                </IconButton>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            ))}
                        </Grid>



                        {/* Addresses */}
                        < Grid >
                            <Typography variant="h6" mt={4}>
                                Addresses
                            </Typography>
                            {
                                addressFields.map((field, index) => (
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
                                                    type='number'
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
                                ))
                            }
                        </Grid>

                        {/* Relatives */}
                        <Grid width={'100%'}>
                            <Typography variant="h6" mt={4}>
                                Relatives
                            </Typography>
                            {relativeFields.map((field, index) => (
                                <Paper key={field.id} sx={{ p: 2, mt: 2, border: '1px solid #ccc' }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                label="Name"
                                                fullWidth
                                                {...register(`relatives.${index}.name`)}
                                                error={!!errors.relatives?.[index]?.name}
                                                helperText={errors.relatives?.[index]?.name?.message}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={3} sx={{ minWidth: 160 }}>
                                            <FormControl fullWidth error={!!errors.relatives?.[index]?.relationship}>
                                                <InputLabel>Relationship</InputLabel>
                                                <Controller
                                                    name={`relatives.${index}.relationship`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select {...field} label="Relationship">
                                                            <MenuItem value="parent">Parent</MenuItem>
                                                            <MenuItem value="sibling">Sibling</MenuItem>
                                                            <MenuItem value="married">Married</MenuItem>
                                                        </Select>
                                                    )}
                                                />
                                                <FormHelperText>{errors.relatives?.[index]?.relationship?.message}</FormHelperText>
                                            </FormControl>
                                        </Grid>

                                        <Grid item xs={12} sm={2}>
                                            <TextField
                                                label="Age"
                                                type="number"
                                                fullWidth
                                                {...register(`relatives.${index}.age`)}
                                                error={!!errors.relatives?.[index]?.age}
                                                helperText={errors.relatives?.[index]?.age?.message}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={3} display="flex" alignItems="center" gap={1}>
                                            <IconButton
                                                onClick={() => removeRelative(index)}
                                                disabled={relativeFields.length === 1}
                                                aria-label="Remove relative"
                                            >
                                                <Remove />
                                            </IconButton>
                                            <IconButton onClick={() => addRelative({ name: '', relationship: '', age: '' })} aria-label="Add relative">
                                                <Add />
                                            </IconButton>
                                        </Grid>

                                        {/* Conditionally show Birth Certificate upload if relationship is 'married' */}
                                        {watch(`relatives.${index}.relationship`) === 'married' && (
                                            <Grid item xs={12} mt={2}>
                                                <Typography variant="subtitle1" gutterBottom>
                                                    Upload Married Certificate
                                                </Typography>
                                                <Button variant="outlined" component="label">
                                                    Choose File
                                                    <input
                                                        type="file"
                                                        hidden
                                                        accept="image/*,application/pdf"
                                                        onChange={(e) => {
                                                            setValue(`documents.${index}.file`, e.target.files[0], {
                                                                shouldValidate: true,
                                                            });
                                                        }}
                                                    />
                                                </Button>
                                                {watch(`documents.${index}.file`)?.name && (
                                                    <Typography variant="body2" mt={1}>
                                                        Selected: {watch(`documents.${index}.file`)?.name}
                                                    </Typography>
                                                )}
                                            </Grid>
                                        )}
                                    </Grid>
                                </Paper>
                            ))}
                        </Grid>


                        {/* Submit */}

                    </Grid>

                    <Grid>
                        <Box mt={3}>
                            <Button variant="contained" color="primary" type="submit">
                                Register
                            </Button>

                        </Box>
                    </Grid>

                </form>
            </Paper>
        </Container >
    );
};

export default SignupForm;
