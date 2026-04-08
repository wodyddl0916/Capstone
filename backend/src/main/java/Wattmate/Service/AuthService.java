package Wattmate.Service;

import Wattmate.DTO.SignupRequest;
import Wattmate.Entity.User;
import Wattmate.Entity.HouseholdType;
import Wattmate.Repository.UserRepository;
import org.springframework.stereotype.Service;
import Wattmate.DTO.LoginRequest;
import Wattmate.DTO.LoginResponse;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void signup(SignupRequest request) {

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setNickname(request.getNickname());
        user.setKepcoCustNo(request.getKepcoCustNo());

        user.setHouseholdType(
                HouseholdType.valueOf(request.getHouseholdType())
        );

        user.setEnergyTemp(36.5f);
        user.setCurrentPoint(0);
        user.setTotalPoint(0);

        userRepository.save(user);
    }
    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("이메일이 존재하지 않습니다."));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        String token = "dummy-token";

        return new LoginResponse(token, "로그인 성공");
    }
}