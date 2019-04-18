import { connect } from 'react-redux';
import LanguageProvider from './LanguageProvider';
import { RootState } from '@common/rematch';

const mapStateToProps = (state: RootState) => ({
    siteVersion: state.SiteVersion,
});

export { LanguageProvider };

export default connect(mapStateToProps)(LanguageProvider);
