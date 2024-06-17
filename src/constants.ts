export class TestConfig {
    BACKEND_URL = "https://hqw51l1t2i.execute-api.us-east-1.amazonaws.com/test"
    PUBLIC_API_KEY = "pk_test_51LoGViKv008lOcIWwZ9EwabpQbjh8gfLoncVeufR7fVtxYhFjTerQ3ZjY0kstPTri0hjiVJ7ncjx2w3uhRayZDPg00pPKf9lzT"
}

export class ProdConfig {
    BACKEND_URL = "https://hqw51l1t2i.execute-api.us-east-1.amazonaws.com/live"
    PUBLIC_API_KEY = "pk_live_51LoGViKv008lOcIWsJguvAVQBO919sTJfzVU52E3hexu9xeQzcGKrLY9XqpF4WWctL2dNFbKzDi9dIqP2iPlErBK00CX5ibvxD"
}

export function getConfig() {
    const hostname = window.location.hostname;
    if (hostname === 'localhost') {
        return new TestConfig();
    } else {
        return new ProdConfig();
    }
}