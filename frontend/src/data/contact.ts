export interface ContactNumber {
  label: string;
  type: 'mobile' | 'additional-mobile' | 'landline';
  display: string;
  tel: string;
  href: string;
  ariaLabel: string;
}

export interface BusinessContact {
  name: string;
  brand: string;
  subtitle: string;
  address: {
    building: string;
    street: string;
    locality: string;
    city: string;
    state: string;
    pincode: string;
    full: string;
  };
  email: string;
  emailHref: string;
  phoneNumbers: {
    mobile: ContactNumber;
    additionalMobile: ContactNumber;
    landline: ContactNumber;
    all: ContactNumber[];
  };
  hours: string;
  transit: string;
  directionsUrl: string;
  embedMapUrl: string;
}

export const businessContact: BusinessContact = {
  name: 'WorkNiva Prime HQ',
  brand: 'WorkNiva',
  subtitle: 'Premium Workspace Platform',
  address: {
    building: 'Gauri Complex, 601',
    street: 'Sector 11',
    locality: 'CBD Belapur',
    city: 'Navi Mumbai',
    state: 'Maharashtra',
    pincode: '400614',
    full: 'Gauri Complex, 601, Sector 11, CBD Belapur, Navi Mumbai, Maharashtra 400614',
  },
  email: 'info@aryahsworld.com',
  emailHref: 'mailto:info@aryahsworld.com',
  phoneNumbers: {
    mobile: {
      label: 'Call us',
      type: 'mobile',
      display: '+91 96199 01999',
      tel: '+919619901999',
      href: 'tel:+919619901999',
      ariaLabel: 'Call WorkNiva primary mobile at +91 96199 01999',
    },
    additionalMobile: {
      label: 'Additional contact',
      type: 'additional-mobile',
      display: '+91 98191 12999',
      tel: '+919819112999',
      href: 'tel:+919819112999',
      ariaLabel: 'Call WorkNiva additional mobile at +91 98191 12999',
    },
    landline: {
      label: 'Landline',
      type: 'landline',
      display: '+91 22 4565 6991',
      tel: '+912245656991',
      href: 'tel:+912245656991',
      ariaLabel: 'Call WorkNiva landline at +91 22 4565 6991',
    },
    get all() {
      return [this.mobile, this.additionalMobile, this.landline];
    },
  },
  hours: '24/7 Access for Confirmed Bookings',
  transit: '5 minutes walk from CBD Belapur Railway Station.',
  directionsUrl: 'https://maps.google.com/maps?q=Aryahs+World+Infotech+OPC+Pvt+Ltd,+Sector+11,+CBD+Belapur',
  embedMapUrl: 'https://maps.google.com/maps?q=Aryahs%20World%20Infotech%20OPC%20Pvt%20Ltd,%20Gauri%20Complex,%20Sector%2011,%20CBD%20Belapur&t=&z=15&ie=UTF8&iwloc=&output=embed',
};
